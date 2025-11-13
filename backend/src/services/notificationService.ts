import Notification from '../models/Notification';
import User from '../models/User';
import { Server } from 'socket.io';

export const createNotification = async (
  userId: string,
  type: 'referral_request' | 'referral_accepted' | 'referral_rejected' | 'payment_received' | 'payment_sent' | 'interview_scheduled' | 'application_update' | 'message' | 'system',
  title: string,
  message: string,
  link?: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  metadata?: Record<string, any>
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const notification = await Notification.create({
    userId,
    userRole: user.role,
    type,
    title,
    message,
    link,
    priority,
    metadata
  });
  
  return notification;
};

export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification', notification);
};
