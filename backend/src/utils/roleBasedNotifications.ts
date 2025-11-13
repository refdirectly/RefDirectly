import { createNotification, emitNotification } from '../services/notificationService';
import { io } from '../server';

// ==================== JOB SEEKER NOTIFICATIONS ====================

export const notifySeekerReferralAccepted = async (
  seekerId: string,
  referrerName: string,
  company: string,
  role: string
) => {
  const notification = await createNotification(
    seekerId,
    'referral_accepted',
    '🎉 Referral Accepted!',
    `${referrerName} accepted your referral request for ${role} at ${company}`,
    '/referrals',
    'high',
    { company, role, referrerName }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

export const notifySeekerReferralRejected = async (
  seekerId: string,
  referrerName: string,
  company: string,
  role: string
) => {
  const notification = await createNotification(
    seekerId,
    'referral_rejected',
    'Referral Not Accepted',
    `${referrerName} declined your referral request for ${role} at ${company}`,
    '/find-referrer',
    'medium',
    { company, role, referrerName }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

export const notifySeekerInterviewScheduled = async (
  seekerId: string,
  company: string,
  role: string,
  interviewDate: string
) => {
  const notification = await createNotification(
    seekerId,
    'interview_scheduled',
    '📅 Interview Scheduled!',
    `Your interview for ${role} at ${company} is scheduled for ${interviewDate}`,
    '/applications',
    'high',
    { company, role, interviewDate }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

export const notifySeekerApplicationUpdate = async (
  seekerId: string,
  company: string,
  role: string,
  status: string
) => {
  const notification = await createNotification(
    seekerId,
    'application_update',
    'Application Update',
    `Your application for ${role} at ${company} is now: ${status}`,
    '/applications',
    status === 'hired' ? 'high' : 'medium',
    { company, role, status }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

export const notifySeekerPaymentSent = async (
  seekerId: string,
  amount: number,
  referrerName: string
) => {
  const notification = await createNotification(
    seekerId,
    'payment_sent',
    '💸 Payment Sent',
    `Payment of $${amount} sent to ${referrerName} for successful referral`,
    '/wallet',
    'medium',
    { amount, referrerName }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

export const notifySeekerNewMessage = async (
  seekerId: string,
  senderName: string,
  preview: string
) => {
  const notification = await createNotification(
    seekerId,
    'message',
    `💬 Message from ${senderName}`,
    preview,
    '/chat',
    'medium',
    { senderName }
  );
  emitNotification(io, seekerId, notification);
  return notification;
};

// ==================== REFERRER NOTIFICATIONS ====================

export const notifyReferrerNewRequest = async (
  referrerId: string,
  seekerName: string,
  company: string,
  role: string,
  reward: number
) => {
  const notification = await createNotification(
    referrerId,
    'referral_request',
    '🤝 New Referral Request',
    `${seekerName} requested a referral for ${role} at ${company} - Reward: $${reward}`,
    '/referrals',
    'high',
    { seekerName, company, role, reward }
  );
  emitNotification(io, referrerId, notification);
  return notification;
};

export const notifyReferrerPaymentReceived = async (
  referrerId: string,
  amount: number,
  seekerName: string,
  company: string
) => {
  const notification = await createNotification(
    referrerId,
    'payment_received',
    '💰 Payment Received!',
    `You received $${amount} for referring ${seekerName} to ${company}`,
    '/wallet',
    'high',
    { amount, seekerName, company }
  );
  emitNotification(io, referrerId, notification);
  return notification;
};

export const notifyReferrerApplicationProgress = async (
  referrerId: string,
  seekerName: string,
  company: string,
  status: string
) => {
  const notification = await createNotification(
    referrerId,
    'application_update',
    '📊 Referral Progress Update',
    `${seekerName}'s application at ${company} is now: ${status}`,
    '/referrals',
    status === 'hired' ? 'high' : 'medium',
    { seekerName, company, status }
  );
  emitNotification(io, referrerId, notification);
  return notification;
};

export const notifyReferrerNewMessage = async (
  referrerId: string,
  senderName: string,
  preview: string
) => {
  const notification = await createNotification(
    referrerId,
    'message',
    `💬 Message from ${senderName}`,
    preview,
    '/chat',
    'medium',
    { senderName }
  );
  emitNotification(io, referrerId, notification);
  return notification;
};

export const notifyReferrerRatingReceived = async (
  referrerId: string,
  seekerName: string,
  rating: number
) => {
  const notification = await createNotification(
    referrerId,
    'system',
    '⭐ New Rating',
    `${seekerName} rated you ${rating}/5 stars`,
    '/profile',
    'low',
    { seekerName, rating }
  );
  emitNotification(io, referrerId, notification);
  return notification;
};

// ==================== COMMON NOTIFICATIONS ====================

export const notifySystemAnnouncement = async (
  userId: string,
  title: string,
  message: string,
  link?: string
) => {
  const notification = await createNotification(
    userId,
    'system',
    title,
    message,
    link,
    'medium'
  );
  emitNotification(io, userId, notification);
  return notification;
};
