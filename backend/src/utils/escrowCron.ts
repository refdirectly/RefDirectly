import cron from 'node-cron';
import { checkExpiredEscrows } from '../services/escrowService';

export const startEscrowCron = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running escrow expiry check...');
    const refunded = await checkExpiredEscrows();
    console.log(`Refunded ${refunded} expired escrows`);
  });
};
