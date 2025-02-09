const express = require('express');
const router = express.Router();
const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '291004',
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
    console.log('Endpoint /api/missions appelé');
    const result = await pool.query('SELECT * FROM mission');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des missions:', err);
    res.status(500).send('Erreur serveur lors de la récupération des missions');
  }
});

// Ajout mission
router.post('/', async (req, res) => {
  const {nomm, dated, datef, competences} = req.body;

  console.log("Compétences reçues : ", competences);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const missionQuery = 'INSERT INTO mission (nomm, dated, datef) VALUES ($1, $2, $3) RETURNING idm';
    const missionResult = await client.query(missionQuery, [nomm, dated, datef]);
    const missionId = missionResult.rows[0].idm;


    await client.query('COMMIT');
    res.status(201).json({message: "Mission ajouté avec ses compétences", idm: missionId});
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
  const {nomm, dated, datef} = req.body;

  if (!nomm || !dated || !datef) {
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
      return res.status(404).send('Mission non trouvé');
    }
   
    await client.query('COMMIT');

    res.status(200).send({identifiant: missionId, nomm, dated, datef});
  } catch (err) {

    await client.query('ROLLBACK');
    console.error('Erreur lors de la mise à jour de la mission :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    client.release();
  }
});

module.exports = router;
