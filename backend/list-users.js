const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diplochain');
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'email firstName lastName role').lean();
    console.log('Users found:');
    console.log(JSON.stringify(users, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

listUsers();
