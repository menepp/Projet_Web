const express = require('express');
const cors = require('cors');
const employeRoutes = require('./employes'); // Import du fichier employes.js
const missionRoutes = require('./missions'); // Import du fichier missions.js

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Utiliser les routes
app.use('/api/employes', employeRoutes);
app.use('/api/missions', missionRoutes);

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});