const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      verified: Boolean
    }));

    const adminEmail = 'refdirectly@gmail.com';
    const adminPassword = 'Admin@123';

    // Check if user exists
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      // Update existing user to admin
      admin.role = 'admin';
      admin.verified = true;
      await admin.save();
      console.log('✅ Updated existing user to admin!');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        verified: true
      });
      await admin.save();
      console.log('✅ Created new admin user!');
    }

    console.log('\nAdmin Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateAdmin();
