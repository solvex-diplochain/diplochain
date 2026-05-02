const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/diplochain';

  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn('Impossible de se connecter à MongoDB:', error.message);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Démarrage de MongoDB en mémoire (mongodb-memory-server)...');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`MongoDB en mémoire connecté: ${conn.connection.host}`);
      return conn;
    }

    console.error('Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;