import cron from 'node-cron';
import { checkExpiredReferrals } from '../controllers/walletController';

export const startScheduler = () => {
  // Run every hour to check for expired referrals
  cron.schedule('0 * * * *', async () => {
    console.log('Running expired referrals check...');
    await checkExpiredReferrals();
  });
  
  console.log('Scheduler started - checking expired referrals every hour');
};
