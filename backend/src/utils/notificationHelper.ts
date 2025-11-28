import { createNotification } from '../services/notificationService';

export const sendNotification = async (
  userId: string,
  type: 'referral_request' | 'referral_accepted' | 'referral_rejected' | 'payment_received' | 'payment_sent' | 'interview_scheduled' | 'application_update' | 'message' | 'system',
  title: string,
  message: string,
  link?: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  metadata?: Record<string, any>
) => {
  return createNotification({ userId, type, title, message, link, priority, metadata });
};

// Deprecated - use roleBasedNotifications instead
export const notifyNewReferral = (userId: string, referrerName: string) => {
  return sendNotification(
    userId,
    'referral_request',
    'New Referral Request',
    `${referrerName} has sent you a referral request`,
    '/referrals',
    'high'
  );
};

export const notifyPaymentReceived = (userId: string, amount: number) => {
  return sendNotification(
    userId,
    'payment_received',
    'Payment Received',
    `You received $${amount} for a successful referral`,
    '/wallet',
    'high'
  );
};

export const notifyNewMessage = (userId: string, senderName: string) => {
  return sendNotification(
    userId,
    'message',
    'New Message',
    `${senderName} sent you a message`,
    '/chat',
    'medium'
  );
};

export const notifyApplicationUpdate = (userId: string, status: string) => {
  return sendNotification(
    userId,
    'application_update',
    'Application Update',
    `Your application status has been updated to: ${status}`,
    '/applications',
    'medium'
  );
};
