const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diplochain');
    console.log('📦 Connexion à MongoDB pour le seed...');

    const adminEmail = 'admin@diplochain.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('ℹ️ Admin déjà existant.');
    } else {
      await User.create({
        firstName: 'Admin',
        lastName: 'DiploChain',
        email: adminEmail,
        password: 'AdminPassword123!', // À changer en production
        role: 'admin',
        isActive: true,
        isEmailVerified: true
      });
      console.log(' Compte Admin créé par défaut : admin@diplochain.com / AdminPassword123!');
    }

    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
