const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est authentifié
const authenticate = (req, res, next) => {
    const userId = req.body.code_employe;  // Récupère l'ID de l'utilisateur dans le corps de la requête
    
    if (!userId) {
      return res.status(403).json({ error: 'Identifiant utilisateur manquant' });
    }
  
    // Vérifiez l'ID de l'utilisateur dans la base de données pour confirmer qu'il est valide
    // Par exemple, vous pouvez effectuer une requête à la base de données pour vérifier que cet ID existe.
  
    // Exemple de vérification simple dans une base de données :
    const query = 'SELECT * FROM liste_personnel WHERE identifiant = $1';
    req.pool.query(query, [userId], (err, result) => {

      if (err || result.rows.length === 0) {
        return res.status(403).json({ error: 'Utilisateur non trouvé' });
      }
  
      req.userId = userId;  // Enregistre l'ID de l'utilisateur dans la requête pour l'utiliser dans la suite
      next();
    });
  };
  
  module.exports = authenticate;