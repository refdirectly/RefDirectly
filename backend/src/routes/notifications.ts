import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, acceptNotification, rejectNotification } from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateJWT, getNotifications);
router.patch('/:notificationId/read', authenticateJWT, markAsRead);
router.patch('/read-all', authenticateJWT, markAllAsRead);
router.post('/:notificationId/accept', authenticateJWT, acceptNotification);
router.post('/:notificationId/reject', authenticateJWT, rejectNotification);

export default router;
