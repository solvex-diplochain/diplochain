const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const diplomaRoutes = require('./routes/diplomas');
const institutionRoutes = require('./routes/institutions');
const employerRoutes = require('./routes/employers');
const blockchainRoutes = require('./routes/blockchain');
const statsRoutes = require('./routes/stats');
const etudiantsRoutes = require('./routes/etudiants');
const diplomesRoutes = require('./routes/diplomes');

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import de la configuration de la base de données
const connectDB = require('./config/database');

// Configuration de l'application Express
const app = express();

// Middlewares de sécurité et de performance
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Augmenté pour le développement
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Rate limiting plus strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Augmenté pour le développement
  message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/etudiants', etudiantsRoutes);
app.use('/api/diplomes', diplomesRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
      console.log(`API disponible sur http://localhost:${PORT}/api`);
    });

    // Gestion gracieuse de l'arrêt
    process.on('SIGTERM', () => {
      console.log('SIGTERM reçu, arrêt gracieux du serveur...');
      server.close(() => {
        console.log('Serveur arrêté.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT reçu, arrêt gracieux du serveur...');
      server.close(() => {
        console.log('Serveur arrêté.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

module.exports = app;