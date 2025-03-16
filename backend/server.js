const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const employeRoutes = require('./employes');
const missionRoutes = require('./missions');

const app = express();
const PORT = 3000;

// Connexion à la base de données
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

// Middleware
app.use(cors());
app.use(express.json());

// Ajouter pool à req pour les routes
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Utiliser les routes
app.use('/api/employes', employeRoutes);
app.use('/api/missions', missionRoutes);

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});