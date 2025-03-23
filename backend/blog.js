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



// Récupérer une mission spécifique par son ID
router.get('/missions/:id', authenticate, async (req, res) => {
  const missionId = req.params.id; // Récupérer l'ID de la mission dans l'URL
  const userId = req.userId; // Récupérer l'ID utilisateur du token JWT

  if (!userId) {
    return res.status(403).json({ error: 'Utilisateur non authentifié' });
  }

  try {
    // Vérifier si l'utilisateur participe à la mission
    const missionResult = await pool.query(
      `SELECT m.idM, m.nomM
       FROM mission m
       JOIN mission_employes me ON m.idM = me.idm
       WHERE me.code_employe = $1 AND m.idM = $2`,
      [userId, missionId]
    );

    if (missionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Vous ne participez pas à cette mission' });
    }

    // Si la mission existe et l'utilisateur y participe, renvoyer les informations
    res.status(200).json({
      missionId: missionResult.rows[0].idM,
      missionName: missionResult.rows[0].nomM,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération de la mission:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les messages de la mission de l'utilisateur connecté
router.get('/getMissionMessages', authenticate, async (req, res) => {
  const userId = req.userId;  // Récupère l'ID utilisateur depuis le token JWT

  try {
      // Vérifier la mission de l'utilisateur
      const missionResult = await pool.query(
          'SELECT idm FROM mission_employes WHERE code_employe = $1',
          [userId]
      );

      if (missionResult.rows.length === 0) {
          return res.status(403).json({ error: 'Vous ne participez à aucune mission' });
      }

      const missionId = missionResult.rows[0].idm;  // ID de la mission de l'utilisateur

      // Récupérer tous les messages de cette mission
      const result = await pool.query(
          `SELECT dm.id_message, dm.message, dm.date_envoi, e.nom, e.prenom 
           FROM discussion_mission dm 
           JOIN liste_personnel e ON e.identifiant = dm.code_employe 
           WHERE dm.idM = $1 
           ORDER BY dm.date_envoi ASC`,
          [missionId]
      );

      res.status(200).json(result.rows);
  } catch (err) {
      console.error('Erreur lors de la récupération des messages', err);
      res.status(500).json({ error: 'Erreur serveur' });
  }
});




  
  
// Envoyer un message

router.post('/send', authenticate, (req, res) => {
  const { message } = req.body;
  const userId = req.userId;  // Récupère l'ID de l'utilisateur validé par le middleware

  if (!message || !userId) {
    return res.status(400).json({ error: 'Message ou utilisateur manquant' });
  }

  // Enregistrement du message dans la base de données
  const query = 'INSERT INTO blog_entreprise (code_employe, message) VALUES ($1, $2)';
  pool.query(query, [userId, message], (err, result) => {  // Utilisez `pool.query` pour l'insertion
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
    }

    res.status(200).json({ success: 'Message envoyé avec succès' });
  });
});

// Envoyer un message dans une mission
router.post('/sendMissionMessage', authenticate, async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;  // L'ID de l'utilisateur connecté

  if (!message || !userId) {
      return res.status(400).json({ error: 'Message ou utilisateur manquant' });
  }

  try {
      // Récupérer l'ID de la mission de l'utilisateur
      const missionResult = await pool.query(
          'SELECT idm FROM mission_employes WHERE code_employe = $1',
          [userId]
      );

      if (missionResult.rows.length === 0) {
          return res.status(403).json({ error: 'Vous ne participez à aucune mission' });
      }

      const missionId = missionResult.rows[0].idm;  // L'ID de la mission

      // Enregistrer le message dans la table discussion_mission
      const query = 'INSERT INTO discussion_mission (idM, code_employe, message) VALUES ($1, $2, $3)';
      await pool.query(query, [missionId, userId, message]);

      res.status(200).json({ success: 'Message envoyé avec succès' });
  } catch (err) {
      console.error('Erreur lors de l\'enregistrement du message', err);
      res.status(500).json({ error: 'Erreur serveur' });
  }
});





module.exports = router;
