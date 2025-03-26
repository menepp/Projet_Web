const express = require('express');
const router = express.Router();
const authenticate = require('./authenticate');

router.get('/', async (req, res) => {
  try {
    const pool = req.pool;
    const result = await pool.query(
      `SELECT e.identifiant, e.nom, e.prenom, b.message, b.date_envoi, b.id_message, b.code_employe
       FROM blog_entreprise b
       JOIN liste_personnel e ON e.identifiant = b.code_employe
       ORDER BY b.date_envoi ASC`
    );

    const blogs = result.rows.map(row => ({
      id_message: row.id_message,
      code_employe: row.code_employe,
      message: row.message,
      date_envoi: row.date_envoi,
      employes: {
        identifiant: row.identifiant,
        nom: row.nom,
        prenom: row.prenom
      }
    }));

    res.status(200).json(blogs);
  } catch (err) {
    console.error('Erreur lors de la récupération des blogs', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/getMissionInfo', authenticate, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur non authentifié' });
  }

  try {
    const pool = req.pool;
    const result = await pool.query(
      `SELECT m.idM, m.nomM
       FROM mission_employes me
       JOIN mission m ON me.idm = m.idM
       WHERE me.code_employe = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucune mission trouvée pour cet employé' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération de la mission', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



router.post('/send', authenticate, (req, res) => {
  const pool = req.pool;  // Récupération du pool depuis la requête
  const { message } = req.body;
  const userId = req.userId;
  if (!message || !userId) {
    return res.status(400).json({ error: 'Message ou utilisateur manquant' });
  }
  const query = 'INSERT INTO blog_entreprise (code_employe, message) VALUES ($1, $2)';
  pool.query(query, [userId, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
    }
    res.status(200).json({ success: 'Message envoyé avec succès' });
  });
});


module.exports = router;
