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
  
// Endpoint pour récupérer tous les employés
router.get('/api/employes', async (req, res) => {
    try {
      console.log('Endpoint /api/employes appelé'); // Log
      const result = await pool.query('SELECT nom, prenom, date_entree FROM liste_personnel'); // Requête SQL
      console.log('Résultats de la requête SQL :', result.rows); // Log
      if (result.rows.length === 0) {
        console.log('Aucun employé trouvé dans la table');
      }
      res.status(200).json(result.rows); // Renvoie les employés au client
    } catch (err) {
      console.error('Erreur lors de la récupération des employés:', err);
      res.status(500).send('Erreur serveur lors de la récupération des employés');
    }
  });
  
// Endpoint pour trier les employés
router.get('/api/employes/sort', async (req, res) => {
    const { criterion, order } = req.query; // Récupération des paramètres de tri
    try {
      let query = 'SELECT nom, prenom, date_entree FROM liste_personnel';
      if (criterion === 'nom') {
        query += ` ORDER BY nom ${order}`;
      } else if (criterion === 'prenom') {
        query += ` ORDER BY prenom ${order}`;
      } else if (criterion === 'date_entree') {
        query += ` ORDER BY date_entree ${order}`;
      }
  
      console.log('Requête SQL exécutée pour tri :', query); // Log
      const result = await pool.query(query); // Requête SQL
      res.status(200).json(result.rows); // Renvoie les employés triés au client
    } catch (err) {
      console.error('Erreur lors du tri des employés:', err);
      res.status(500).send('Erreur serveur lors du tri des employés');
    }
  });
  
module.exports = router;
