import Notification from '../models/Notification';
import { io } from '../server';

export const createNotification = async (data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: string;
  link?: string;
  actionLabel?: string;
  icon?: string;
  referralId?: string;
  applicationId?: string;
  metadata?: any;
}) => {
  const notification = await Notification.create(data);
  
  // Emit real-time notification via Socket.IO
  io.to(data.userId).emit('notification', notification);
  
  return notification;
};

// Job Seeker Notifications
export const notifyApplicationSubmitted = async (userId: string, jobTitle: string, company: string, applicationId: string) => {
  return createNotification({
    userId,
    type: 'application_submitted',
    title: 'Application Successfully Submitted',
    message: `Your application for ${jobTitle} at ${company} has been processed and submitted to the employer.`,
    priority: 'medium',
    link: `/applications`,
    actionLabel: 'Track Application',
    icon: 'CheckCircle',
    applicationId
  });
};

export const notifyReferralAccepted = async (userId: string, referrerName: string, company: string, referralId: string) => {
  return createNotification({
    userId,
    type: 'referral_accepted',
    title: 'Referral Connection Established',
    message: `A verified professional at ${company} has accepted your referral request. Secure communication channel is now active.`,
    priority: 'high',
    link: `/seeker/chat?room=${referralId}`,
    actionLabel: 'Access Secure Chat',
    icon: 'MessageCircle',
    referralId
  });
};

export const notifyReferralRejected = async (userId: string, company: string, role: string) => {
  return createNotification({
    userId,
    type: 'referral_rejected',
    title: 'Referral Request Status Update',
    message: `Your referral request for ${role} at ${company} could not be processed at this time. Alternative matches are available.`,
    priority: 'medium',
    link: `/find-referrer`,
    actionLabel: 'Explore Alternatives',
    icon: 'XCircle'
  });
};

export const notifyInterviewScheduled = async (userId: string, company: string, date: string) => {
  return createNotification({
    userId,
    type: 'interview_scheduled',
    title: 'Interview Confirmation',
    message: `Your interview with ${company} has been confirmed for ${date}. Preparation resources available.`,
    priority: 'urgent',
    link: `/applications`,
    actionLabel: 'View Interview Details',
    icon: 'Calendar'
  });
};

export const notifyJobMatch = async (userId: string, jobTitle: string, company: string) => {
  return createNotification({
    userId,
    type: 'job_match',
    title: 'New Opportunity Match',
    message: `AI-powered matching identified: ${jobTitle} at ${company} aligns with your profile.`,
    priority: 'medium',
    link: `/jobs`,
    actionLabel: 'Review Opportunity',
    icon: 'Briefcase'
  });
};

// Professional Referrer Notifications
export const notifyNewReferralRequest = async (userId: string, seekerName: string, company: string, role: string, referralId: string) => {
  return createNotification({
    userId,
    type: 'referral_request',
    title: 'New Referral Opportunity',
    message: `Qualified candidate seeking referral for ${role} position at ${company}. Review profile and credentials.`,
    priority: 'high',
    link: `/referrer/requests`,
    actionLabel: 'Review Request',
    icon: 'Bell',
    referralId
  });
};

export const notifyReferralCompleted = async (userId: string, seekerName: string, amount: number, referralId: string) => {
  return createNotification({
    userId,
    type: 'referral_completed',
    title: 'Referral Transaction Completed',
    message: `Referral submission confirmed. Compensation of ₹${amount.toLocaleString()} has been processed to your account.`,
    priority: 'high',
    link: `/referrer/wallet`,
    actionLabel: 'View Transaction',
    icon: 'DollarSign',
    referralId,
    metadata: { amount }
  });
};

export const notifyPaymentReceived = async (userId: string, amount: number, referralId: string) => {
  return createNotification({
    userId,
    type: 'payment_received',
    title: 'Payment Processed Successfully',
    message: `₹${amount.toLocaleString()} has been credited to your account. Transaction details available.`,
    priority: 'high',
    link: `/referrer/wallet`,
    actionLabel: 'View Account',
    icon: 'Wallet',
    referralId,
    metadata: { amount }
  });
};

export const notifyMessageReceived = async (userId: string, senderName: string, roomId: string) => {
  return createNotification({
    userId,
    type: 'message_received',
    title: 'New Secure Message',
    message: `You have received a new message in your end-to-end encrypted communication channel.`,
    priority: 'medium',
    link: `/chat?room=${roomId}`,
    actionLabel: 'Open Secure Chat',
    icon: 'MessageCircle'
  });
};

// System Notifications
export const notifyWelcome = async (userId: string, role: string) => {
  const message = role === 'referrer' 
    ? 'Your professional referrer account is now active. Begin reviewing qualified referral opportunities and build your network.'
    : 'Your account has been successfully activated. Access our AI-powered platform to connect with verified industry professionals.';
    
  return createNotification({
    userId,
    type: 'welcome',
    title: 'Account Activation Successful',
    message,
    priority: 'medium',
    link: role === 'referrer' ? '/referrer/dashboard' : '/dashboard',
    actionLabel: 'Access Dashboard',
    icon: 'Sparkles'
  });
};
