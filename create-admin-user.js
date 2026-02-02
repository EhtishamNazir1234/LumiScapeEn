/**
 * Script to create an admin user for LumiScape
 * Run this with: node create-admin-user.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.model.js';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumiscape';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lumiscape.com' });
    if (existingAdmin) {
      console.log(' Admin user already exists!');
      console.log('   Email: admin@lumiscape.com');
      console.log('   You can login with this account or create a new one.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@lumiscape.com',
      password: 'admin123', // Will be hashed automatically
      role: 'super-admin',
      userId: 'ADMIN-001',
      status: 'Active',
      country: 'Not assigned'
    });

    console.log(' Admin user created successfully!');
    console.log('Login Credentials:');
    console.log('   Email: admin@lumiscape.com');
    console.log('   Password: admin123');
    console.log('   Role: super-admin');
    console.log(' Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error(' Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
