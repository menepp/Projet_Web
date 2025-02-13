const express = require('express');
const router = express.Router();
const {Pool} = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'menep',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à la base de données :', err);
  }
  console.log('Connexion à PostgreSQL réussie');
  release();
});

//récupérer employés
router.get("/", async (req, res) => {
  try {
    console.log("🔵 Requête reçue : GET /api/employes");

    const result = await pool.query(`
      SELECT P.identifiant,
             P.nom,
             P.prenom,
             P.date_entree,
             COALESCE(STRING_AGG(C.description_competence_fr, ', '), '') AS competences
      FROM liste_personnel P
      LEFT JOIN competence_personnel CP ON P.identifiant = CP.code_employe
      LEFT JOIN liste_competences C ON CP.code_skill = C.code_skill
      GROUP BY P.identifiant, P.nom, P.prenom, P.date_entree
    `);

    const result2 = await pool.query("SELECT code_skill, description_competence_fr FROM liste_competences");

    console.log(" Employés récupérés :", result.rows);
    console.log(" Compétences récupérées :", result2.rows);

    res.status(200).json({
      employes: result.rows,
      competences: result2.rows, 
    });
  } catch (err) {
    console.error(" Erreur serveur :", err);
    res.status(500).send("Erreur serveur lors de la récupération des employés");
  }
});


//ajouter un employé
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, date_entree, competences } = req.body;

    const employeResult = await pool.query(
      'INSERT INTO liste_personnel (nom, prenom, date_entree) VALUES ($1, $2, $3) RETURNING identifiant',
      [nom, prenom, date_entree]
    );
    const employeId = employeResult.rows[0].identifiant;

    if (Array.isArray(competences) && competences.length > 0) {
      const values = competences.map(skillId => `(${employeId}, '${skillId}')`).join(',');
      await pool.query(`INSERT INTO competence_personnel (code_employe, code_skill) VALUES ${values}`);
    }

    res.status(201).json({ message: 'Employé ajouté avec succès' });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'employé :", err);
    res.status(500).send("Erreur serveur");
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

//modifier employé
router.put('/:id', async (req, res) => {
  const { id: employeeId } = req.params;
  const { nom, prenom, date_entree, competences } = req.body;

  if (!nom || !prenom || !date_entree || !competences) {
    return res.status(400).send('Données manquantes');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateQuery = `UPDATE liste_personnel SET nom = $1, prenom = $2, date_entree = $3 WHERE identifiant = $4 RETURNING *`;
    const updateResult = await client.query(updateQuery, [nom, prenom, date_entree, employeeId]);

    if (!updateResult.rowCount) {
      return res.status(404).send('Employé non trouvé');
    }

    await client.query(`DELETE FROM competence_personnel WHERE code_employe = $1`, [employeeId]);

    for (const skillId of competences) {
      const skillExists = await client.query(`SELECT 1 FROM liste_competences WHERE code_skill = $1`, [skillId]);

      if (!skillExists.rowCount) {
        return res.status(404).send(`Compétence non trouvée pour l'ID: ${skillId}`);
      }

      await client.query(`INSERT INTO competence_personnel (code_employe, code_skill) VALUES ($1, $2)`, [employeeId, skillId]);
    }

    await client.query('COMMIT');
    res.status(200).send({ identifiant: employeeId, nom, prenom, date_entree, competences });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});








module.exports = router;
