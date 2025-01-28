const express = require('express');
const router = express.Router();
const { Pool } = require('pg');


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

// pour récupérer tous les employés
router.get('/', async (req, res) => {
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

// Ajout de l'employé à la base de données
router.post('/', async (req, res) => {
    const { prenom, nom, date_entree } = req.body;
    const query = 'INSERT INTO liste_personnel (prenom, nom, date_entree) VALUES ($1, $2, $3) RETURNING *';
    const values = [prenom, nom, date_entree];
    
    try {
      const result = await pool.query(query, values);
      const newEmployee = result.rows[0];
      res.status(201).json(newEmployee);  // Renvoie l'employé ajouté
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'employé :', err);
      res.status(500).send('Erreur serveur lors de l\'ajout de l\'employé');
    }
  });
  
  

module.exports = router;
