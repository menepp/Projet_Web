const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const userId = req.body.code_employe || req.query.code_employe || req.headers.authorization?.split(' ')[1];

  if (!userId) {
    return res.status(403).json({ error: 'Identifiant utilisateur manquant' });
  }

  const query = 'SELECT * FROM liste_personnel WHERE identifiant = $1';
  req.pool.query(query, [userId], (err, result) => {
    if (err || result.rows.length === 0) {
      return res.status(403).json({ error: 'Utilisateur non trouvé' });
    }
    req.userId = userId;
    next();
  });
};

module.exports = authenticate;
