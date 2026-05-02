// Middleware de gestion d'erreurs centralisée
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  console.error('Erreur:', err);

  // Erreurs de Mongoose - CastError (ID invalide)
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = { message, statusCode: 404 };
  }

  // Erreurs de Mongoose - Duplicate key
  if (err.code === 11000) {
    const message = 'Valeur dupliquée entrée';
    error = { message, statusCode: 400 };
  }

  // Erreurs de Mongoose - Validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token JWT invalide';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token JWT expiré';
    error = { message, statusCode: 401 };
  }

  // Réponse d'erreur
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} non trouvée`);
  error.statusCode = 404;
  next(error);
};

module.exports = errorHandler;