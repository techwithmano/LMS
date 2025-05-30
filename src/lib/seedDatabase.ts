import mongoose from 'mongoose';
import dbConnect from './dbConnect';
import User from '../models/User';

async function seedDatabase() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Create admin user with simple ID and password
    const adminUser = {
      name: 'Abdulrahman Haramain',
      userId: 'AD001',
      password: 'Abod3001',  // Stored as plain text
      email: 'officialtechwithmano@gmail.com',  // Optional
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ userId: adminUser.userId });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user
    await User.create(adminUser);
    console.log('Admin user seeded successfully');
    console.log('Login credentials:');
    console.log('User ID:', adminUser.userId);
    console.log('Password:', adminUser.password);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();