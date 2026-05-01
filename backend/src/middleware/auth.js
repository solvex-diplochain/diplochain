const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes (authentification requise)
const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est présent dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide. Utilisateur non trouvé.'
        });
      }

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé.'
        });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification.'
    });
  }
};

// Middleware pour vérifier les rôles (autorisation)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rôle ${req.user.role} non autorisé pour cette action.`
      });
    }

    next();
  };
};

// Middleware optionnel pour l'authentification (pas d'erreur si pas de token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalide, mais on continue sans erreur
        console.log('Token optionnel invalide:', error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth
};