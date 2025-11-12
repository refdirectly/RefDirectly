import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Referral from '../models/Referral';
import User from '../models/User';

dotenv.config();

async function addTestReferrals() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/referus');
    console.log('Connected to MongoDB');

    const users = await User.find();
    const seeker = users.find(u => u.role === 'seeker');
    const referrer = users.find(u => u.role === 'referrer');

    if (!seeker || !referrer) {
      console.log('Please create at least one seeker and one referrer user first');
      process.exit(1);
    }

    const testReferrals = [
      {
        seekerId: seeker._id,
        referrerId: referrer._id,
        company: 'Google',
        role: 'Software Engineer',
        status: 'accepted',
        reward: 99,
        message: 'Looking for a referral at Google for SWE role',
        seekerProfile: {
          name: seeker.name,
          email: seeker.email,
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: '3 years'
        }
      },
      {
        seekerId: seeker._id,
        referrerId: referrer._id,
        company: 'Microsoft',
        role: 'Senior Developer',
        status: 'accepted',
        reward: 99,
        message: 'Interested in Microsoft opportunities',
        seekerProfile: {
          name: seeker.name,
          email: seeker.email,
          skills: ['Python', 'Django', 'AWS'],
          experience: '5 years'
        }
      },
      {
        seekerId: seeker._id,
        company: 'Amazon',
        role: 'Full Stack Developer',
        status: 'pending',
        reward: 99,
        message: 'Need referral for Amazon',
        seekerProfile: {
          name: seeker.name,
          email: seeker.email,
          skills: ['Java', 'Spring Boot', 'Microservices'],
          experience: '4 years'
        }
      }
    ];

    await Referral.insertMany(testReferrals);
    console.log('✅ Test referrals added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestReferrals();
