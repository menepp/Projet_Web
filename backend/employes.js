const express = require('express');
const router = express.Router();
const {Pool} = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'web',
  password: 'milo12',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à la base de données :', err);
  }
  console.log('Connexion à PostgreSQL réussie');
  release();
});

// récupère les employés
router.get('/', async (req, res) => {
  try {
    console.log('Endpoint /api/employes appelé');

    const result = await pool.query(`
      SELECT P.identifiant,
             P.nom,
             P.prenom,
             P.date_entree,
             COALESCE(STRING_AGG(C.code_skill, ', '), '') AS competences
      FROM liste_personnel P
      LEFT JOIN competence_personnel CP ON P.identifiant = CP.code_employe
      LEFT JOIN liste_competences C ON CP.code_skill = C.code_skill
      GROUP BY P.identifiant, P.nom, P.prenom, P.date_entree
    `);

    console.log('Résultats de la requête SQL :', result.rows);

    if (result.rows.length === 0) {
      console.log('Aucun employé trouvé dans la table');
    }

    res.status(200).json(result.rows); // Retourner les employés avec leurs compétences
  } catch (err) {
    console.error('Erreur lors de la récupération des employés:', err);
    res.status(500).send('Erreur serveur lors de la récupération des employés');
  }
});


// Ajout employé
router.post('/', async (req, res) => {
  const {prenom, nom, date_entree, competences} = req.body;

  console.log("Compétences reçues : ", competences);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const employeQuery = 'INSERT INTO liste_personnel (prenom, nom, date_entree) VALUES ($1, $2, $3) RETURNING identifiant';
    const employeResult = await client.query(employeQuery, [prenom, nom, date_entree]);
    const employeId = employeResult.rows[0].identifiant;

    if (competences && competences.length > 0) {
      const competencesArray = competences.split(',').map(comp => comp.trim());

      for (const competence of competencesArray) {
        const competenceCheckQuery = 'SELECT code_skill FROM liste_competences WHERE code_skill = $1';
        const competenceResult = await client.query(competenceCheckQuery, [competence]);

        if (competenceResult.rows.length === 0) {
          const insertCompetenceQuery = 'INSERT INTO liste_competences (code_skill) VALUES ($1)';
          await client.query(insertCompetenceQuery, [competence]);
        }
        await client.query(
          'INSERT INTO competence_personnel (code_employe, code_skill) VALUES ($1, $2)',
          [employeId, competence]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({message: "Employé ajouté avec ses compétences", identifiant: employeId});
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'ajout de l\'employé et des compétences :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});

//supprimer employe
router.delete('/:id', async (req, res) => {
  const employeeId = req.params.id;
  console.log('ID reçu pour suppression :', employeeId);

  if (!employeeId) {
    return res.status(400).send('ID de l\'employé non fourni');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const deleteCompetencesQuery = 'DELETE FROM competence_personnel WHERE code_employe = $1';
    await client.query(deleteCompetencesQuery, [employeeId]);

    const deleteEmployeeQuery = 'DELETE FROM liste_personnel WHERE identifiant = $1';
    const result = await client.query(deleteEmployeeQuery, [employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).send('Employé non trouvé');
    }

    await client.query('COMMIT');
    res.status(200).send('Employé supprimé avec succès');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la suppression de l\'employé :', err);
    res.status(500).send('Erreur serveur lors de la suppression de l\'employé');
  } finally {
    client.release();
  }
});

// Modifier employé
router.put('/:id', async (req, res) => {
  const employeeId = req.params.id;
  const {nom, prenom, date_entree, competences} = req.body;

  if (!nom || !prenom || !date_entree || !competences) {
    return res.status(400).send('Données manquantes');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `UPDATE liste_personnel
                   SET nom = $1, prenom = $2, date_entree = $3
                   WHERE identifiant = $4 RETURNING *`;
    const values = [nom, prenom, date_entree, employeeId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Employé non trouvé');
    }
    const deleteQuery = `DELETE FROM competence_personnel WHERE code_employe = $1`;
    await client.query(deleteQuery, [employeeId]);
    const insertQuery = `INSERT INTO competence_personnel (code_employe, code_skill) VALUES ($1, $2)`;
    for (const competence of competences) {
      await client.query(insertQuery, [employeeId, competence]);
    }
    await client.query('COMMIT');

    res.status(200).send({identifiant: employeeId, nom, prenom, date_entree, competences});
  } catch (err) {

    await client.query('ROLLBACK');
    console.error('Erreur lors de la mise à jour de l\'employé :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});


module.exports = router;
