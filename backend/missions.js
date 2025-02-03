const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configuration de la connexion à PostgreSQL
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
      console.log('Endpoint /api/missions appelé');
      const result = await pool.query('SELECT * FROM liste_mission');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Erreur lors de la récupération des missions:', err);
      res.status(500).send('Erreur serveur lors de la récupération des missions');
    }
  });
  
  module.exports = router;
