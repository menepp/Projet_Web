const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurer les informations de connexion à Oracle
const dbConfig = {
  user: 'VOTRE_UTILISATEUR', // Remplacez par votre utilisateur Oracle
  password: 'VOTRE_MOT_DE_PASSE', // Remplacez par votre mot de passe
  connectString: 'HOTE:PORT/NOM_SERVICE' // Exemple: 'localhost:1521/ORCL'
};

// Endpoint pour récupérer les données d'une table
app.get('/api/data', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Exemple de requête SQL
    const result = await connection.execute(`SELECT * FROM VOTRE_TABLE`);

    // Retourne les données sous forme JSON
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur de connexion à la base Oracle :', err);
    res.status(500).send('Erreur lors de la récupération des données');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
      }
    }
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
