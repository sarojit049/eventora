const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const config = require('../config');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in environment variables.');
      process.exit(1);
    }

    console.log(`🌱 Connecting to MongoDB: ${config.mongodb.uri}`);
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`ℹ️  Admin user ${adminEmail} already exists.`);
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log(`✅ Updated ${adminEmail} role to admin.`);
      }
    } else {
      console.log(`👤 Creating admin user: ${adminEmail}...`);
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully.');
    }

    console.log('════════════════════════════════════════════');
    console.log('  ✅ Admin seed script completed!');
    console.log('════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed admin error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
