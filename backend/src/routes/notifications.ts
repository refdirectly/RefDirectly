import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createTestNotification
} from '../controllers/notificationController';
import {
  testSeekerNotifications,
  testReferrerNotifications
} from '../controllers/testNotificationController';

const router = express.Router();

router.get('/', authenticateJWT, getNotifications);
router.get('/unread-count', authenticateJWT, getUnreadCount);
router.post('/test', authenticateJWT, createTestNotification);
router.post('/test-seeker', authenticateJWT, testSeekerNotifications);
router.post('/test-referrer', authenticateJWT, testReferrerNotifications);
router.patch('/:notificationId/read', authenticateJWT, markAsRead);
router.patch('/mark-all-read', authenticateJWT, markAllAsRead);
router.delete('/:notificationId', authenticateJWT, deleteNotification);

export default router;
