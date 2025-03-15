const express = require('express');
const router = express.Router();

// Récupérer tous les employés
router.get('/', async (req, res) => {
  try {
    console.log('🔵 Requête reçue : GET /api/employes');
    const pool = req.pool;

    const result = await pool.query(`
      SELECT P.identifiant, P.nom, P.prenom, P.date_entree, P.email, P.mot_de_passe, P.role_employe,
             COALESCE(STRING_AGG(C.description_competence_fr, ', '), '') AS competences
      FROM liste_personnel P
      LEFT JOIN competence_personnel CP ON P.identifiant = CP.code_employe
      LEFT JOIN liste_competences C ON CP.code_skill = C.code_skill
      GROUP BY P.identifiant, P.nom, P.prenom, P.date_entree, P.email, P.mot_de_passe, P.role_employe
    `);

    res.status(200).json({ employes: result.rows });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).send("Erreur serveur lors de la récupération des employés");
  }
});

router.post('/', async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const emailExists = await req.pool.query(
      'SELECT * FROM liste_personnel WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'Un employé avec cet email existe déjà.' });
    }

    // Insertion de l'employé
    const employeResult = await req.pool.query(
      'INSERT INTO liste_personnel (nom, prenom, email, mot_de_passe, role_employe, date_entree) VALUES ($1, $2, $3, $4, $5, $6) RETURNING identifiant',
      [nom, prenom, email, mot_de_passe, role_employe, date_entree]
    );
    const employeId = employeResult.rows[0].identifiant;

    // Insertion des compétences
    if (competences && competences.length > 0) {
      for (const competence of competences) {
        await req.pool.query(
          'INSERT INTO competence_personnel (code_employe, code_skill) VALUES ($1, $2)',
          [employeId, competence]
        );
      }
    }

    res.status(201).json({ message: 'Employé ajouté avec succès', employeId });
  } catch (err) {
    console.error("Erreur détaillée lors de l'ajout de l'employé :", err);
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

  const client = await req.pool.connect(); // Utiliser req.pool ici, pas pool
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

  const client = await req.pool.connect();
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
