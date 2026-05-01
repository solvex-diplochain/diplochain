// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} non trouvée`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;