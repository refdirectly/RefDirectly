import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { notificationId } = req.params;
    
    await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await Notification.updateMany({ userId, read: false }, { read: true });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { notificationId } = req.params;
    
    await Notification.findOneAndDelete({ _id: notificationId, userId });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

export const createTestNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = (req as any).user;
    
    const notification = await Notification.create({
      userId,
      userRole: user.role,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification',
      priority: 'medium',
      read: false
    });
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create test notification' });
  }
};
