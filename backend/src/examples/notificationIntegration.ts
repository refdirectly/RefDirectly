/**
 * Example: How to integrate notifications into existing controllers
 */

import { sendNotification, notifyNewReferral, notifyPaymentReceived } from '../utils/notificationHelper';

// Example 1: In Referral Controller
export const createReferralExample = async (req: any, res: any) => {
  // ... existing referral creation logic
  const referral = { seekerId: 'user123', company: 'Google', role: 'SWE' };
  const seekerId = referral.seekerId;
  const referrerName = req.user.name;
  
  // Send notification
  await notifyNewReferral(seekerId, referrerName);
  
  res.json({ success: true, referral });
};

// Example 2: In Payment Controller
export const processPaymentExample = async (req: any, res: any) => {
  // ... existing payment processing logic
  const payment = { userId: 'user123', amount: 100 };
  
  // Send notification
  await notifyPaymentReceived(payment.userId, payment.amount);
  
  res.json({ success: true, payment });
};

// Example 3: Custom Notification
export const customNotificationExample = async (req: any, res: any) => {
  const userId = req.user.id;
  
  await sendNotification(
    userId,
    'system',
    'Welcome!',
    'Welcome to ReferAI platform',
    '/dashboard',
    'medium',
    { isWelcome: true }
  );
  
  res.json({ success: true });
};

// Example 4: Bulk Notifications
export const sendBulkNotifications = async (userIds: string[], title: string, message: string) => {
  const promises = userIds.map(userId => 
    sendNotification(userId, 'system', title, message, undefined, 'medium')
  );
  await Promise.all(promises);
};
