const mongoose = require('mongoose');
const User = require('../models/User');
const Institution = require('../models/Institution');
require('dotenv').config();

const repair = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const institutionUsers = await User.find({ role: 'institution' });
    console.log(`Found ${institutionUsers.length} users with role 'institution'`);

    for (const user of institutionUsers) {
      const existingInst = await Institution.findOne({ adminUser: user._id });
      if (!existingInst) {
        console.log(`Creating institution profile for ${user.email}...`);
        const baseName = `${user.firstName} ${user.lastName}`.trim() || 'Institution';
        const uniqueName = `${baseName} (${user.email})`;
        
        await Institution.create({
          name: uniqueName,
          email: user.email,
          adminUser: user._id,
          isActive: true,
          isVerified: true
        });
        console.log(`✅ Created for ${user.email}`);
      } else {
        console.log(`✔ Institution already exists for ${user.email}`);
      }
    }

    console.log('Repair complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during repair:', err);
    process.exit(1);
  }
};

repair();
