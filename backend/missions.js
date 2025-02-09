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

router.get('/', async (req, res) => {
  try {
    console.log('📡 Requête reçue : GET /api/missions');

    const result = await pool.query(`
      SELECT M.idm, M.nomm, M.dated, M.datef,
             COALESCE(STRING_AGG(C.description_competence_fr, ', '), '') AS competences
      FROM mission M
      LEFT JOIN mission_competences MC ON M.idm = MC.idm
      LEFT JOIN liste_competences C ON MC.code_skill = C.code_skill
      GROUP BY M.idm, M.nomm, M.dated, M.datef
    `);

    const result2 = await pool.query("SELECT code_skill, description_competence_fr FROM liste_competences");

    console.log(" Missions récupérées :", result.rows);
    console.log(" Compétences disponibles :", result2.rows);

    res.status(200).json({
      missions: result.rows,
      competences: result2.rows, 
    });
  } catch (err) {
    console.error(" Erreur lors de la récupération des missions :", err);
    res.status(500).send("Erreur serveur");
  }
});


// Ajout mission
router.post('/', async (req, res) => {
  const { nomm, dated, datef, competences } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const missionQuery = 'INSERT INTO mission (nomm, dated, datef) VALUES ($1, $2, $3) RETURNING idm';
    const missionResult = await client.query(missionQuery, [nomm, dated, datef]);
    const missionId = missionResult.rows[0].idm;

    if (Array.isArray(competences) && competences.length > 0) {
      const values = competences.map(skillId => `(${missionId}, '${skillId}')`).join(',');
      await client.query(`INSERT INTO mission_competences (idm, code_skill) VALUES ${values}`);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: "Mission ajoutée avec ses compétences", idm: missionId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'ajout de la mission et des compétences :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});


//supprimer mission
router.delete('/:id', async (req, res) => {
  const missionId = req.params.id;
  console.log('ID reçu pour suppression :', missionId);

  if (!missionId) {
    return res.status(400).send('ID de l\'employé non fourni');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const deletemissionQuery = 'DELETE FROM mission WHERE idm = $1';
    const result = await client.query(deletemissionQuery, [missionId]);

    if (result.rowCount === 0) {
      return res.status(404).send('Mission non trouvé');
    }

    await client.query('COMMIT');
    res.status(200).send('Mission supprimé avec succès');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la suppression de la mission :', err);
    res.status(500).send('Erreur serveur lors de la suppression de la mission');
  } finally {
    client.release();
  }
});

// Modifier mission
router.put('/:id', async (req, res) => {
  const missionId = req.params.id;
  const { nomm, dated, datef, competences } = req.body; 
  if (!nomm || !dated || !datef || !competences) {
    return res.status(400).send('Données manquantes');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `UPDATE mission
                   SET nomm = $1, dated = $2, datef = $3
                   WHERE idm = $4 RETURNING *`;
    const values = [nomm, dated, datef, missionId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Mission non trouvée');
    }

    await client.query('DELETE FROM mission_competences WHERE idm = $1', [missionId]);

    for (const skillId of competences) {
      const skillExists = await client.query(`SELECT 1 FROM liste_competences WHERE code_skill = $1`, [skillId]);

      if (!skillExists.rowCount) {
        return res.status(404).send(`Compétence non trouvée pour l'ID: ${skillId}`);
      }

      await client.query(`INSERT INTO mission_competences (idm, code_skill) VALUES ($1, $2)`, [missionId, skillId]);
    }

    await client.query('COMMIT');
    res.status(200).send({ idm: missionId, nomm, dated, datef, competences });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la mise à jour de la mission :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});


module.exports = router;
