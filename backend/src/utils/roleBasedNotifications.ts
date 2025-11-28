import { createNotification } from '../services/notificationService';

// ==================== JOB SEEKER NOTIFICATIONS ====================

export const notifySeekerReferralAccepted = async (
  seekerId: string,
  referrerName: string,
  company: string,
  role: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'referral_accepted',
    title: '🎉 Referral Accepted!',
    message: `${referrerName} accepted your referral request for ${role} at ${company}`,
    link: '/referrals',
    priority: 'high',
    metadata: { company, role, referrerName }
  });
};

export const notifySeekerReferralRejected = async (
  seekerId: string,
  referrerName: string,
  company: string,
  role: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'referral_rejected',
    title: 'Referral Not Accepted',
    message: `${referrerName} declined your referral request for ${role} at ${company}`,
    link: '/find-referrer',
    priority: 'medium',
    metadata: { company, role, referrerName }
  });
};

export const notifySeekerInterviewScheduled = async (
  seekerId: string,
  company: string,
  role: string,
  interviewDate: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'interview_scheduled',
    title: '📅 Interview Scheduled!',
    message: `Your interview for ${role} at ${company} is scheduled for ${interviewDate}`,
    link: '/applications',
    priority: 'high',
    metadata: { company, role, interviewDate }
  });
};

export const notifySeekerApplicationUpdate = async (
  seekerId: string,
  company: string,
  role: string,
  status: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'application_update',
    title: 'Application Update',
    message: `Your application for ${role} at ${company} is now: ${status}`,
    link: '/applications',
    priority: status === 'hired' ? 'high' : 'medium',
    metadata: { company, role, status }
  });
};

export const notifySeekerPaymentSent = async (
  seekerId: string,
  amount: number,
  referrerName: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'payment_sent',
    title: '💸 Payment Sent',
    message: `Payment of $${amount} sent to ${referrerName} for successful referral`,
    link: '/wallet',
    priority: 'medium',
    metadata: { amount, referrerName }
  });
};

export const notifySeekerNewMessage = async (
  seekerId: string,
  senderName: string,
  preview: string
) => {
  return createNotification({
    userId: seekerId,
    type: 'message',
    title: `💬 Message from ${senderName}`,
    message: preview,
    link: '/chat',
    priority: 'medium',
    metadata: { senderName }
  });
};

// ==================== REFERRER NOTIFICATIONS ====================

export const notifyReferrerNewRequest = async (
  referrerId: string,
  seekerName: string,
  company: string,
  role: string,
  reward: number
) => {
  return createNotification({
    userId: referrerId,
    type: 'referral_request',
    title: '🤝 New Referral Request',
    message: `${seekerName} requested a referral for ${role} at ${company} - Reward: $${reward}`,
    link: '/referrals',
    priority: 'high',
    metadata: { seekerName, company, role, reward }
  });
};

export const notifyReferrerPaymentReceived = async (
  referrerId: string,
  amount: number,
  seekerName: string,
  company: string
) => {
  return createNotification({
    userId: referrerId,
    type: 'payment_received',
    title: '💰 Payment Received!',
    message: `You received $${amount} for referring ${seekerName} to ${company}`,
    link: '/wallet',
    priority: 'high',
    metadata: { amount, seekerName, company }
  });
};

export const notifyReferrerApplicationProgress = async (
  referrerId: string,
  seekerName: string,
  company: string,
  status: string
) => {
  return createNotification({
    userId: referrerId,
    type: 'application_update',
    title: '📊 Referral Progress Update',
    message: `${seekerName}'s application at ${company} is now: ${status}`,
    link: '/referrals',
    priority: status === 'hired' ? 'high' : 'medium',
    metadata: { seekerName, company, status }
  });
};

export const notifyReferrerNewMessage = async (
  referrerId: string,
  senderName: string,
  preview: string
) => {
  return createNotification({
    userId: referrerId,
    type: 'message',
    title: `💬 Message from ${senderName}`,
    message: preview,
    link: '/chat',
    priority: 'medium',
    metadata: { senderName }
  });
};

export const notifyReferrerRatingReceived = async (
  referrerId: string,
  seekerName: string,
  rating: number
) => {
  return createNotification({
    userId: referrerId,
    type: 'system',
    title: '⭐ New Rating',
    message: `${seekerName} rated you ${rating}/5 stars`,
    link: '/profile',
    priority: 'low',
    metadata: { seekerName, rating }
  });
};

// ==================== COMMON NOTIFICATIONS ====================

export const notifySystemAnnouncement = async (
  userId: string,
  title: string,
  message: string,
  link?: string
) => {
  return createNotification({
    userId,
    type: 'system',
    title,
    message,
    link,
    priority: 'medium'
  });
};
