import mongoose from 'mongoose';
import Referral from '../models/Referral';
import Job from '../models/Job';

async function migrateReferrals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referai');
    console.log('Connected to MongoDB');

    const referrals = await Referral.find({}).populate('jobId');
    console.log(`Found ${referrals.length} referrals to migrate`);

    let updated = 0;
    for (const referral of referrals) {
      if (!referral.company || !referral.role) {
        const jobData = referral.jobId as any;
        await Referral.updateOne(
          { _id: referral._id },
          {
            $set: {
              company: jobData?.company || 'Unknown Company',
              role: jobData?.title || 'Unknown Position'
            }
          }
        );
        updated++;
      }
    }

    console.log(`Migration complete! Updated ${updated} referrals`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateReferrals();
