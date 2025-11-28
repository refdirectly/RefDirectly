import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, acceptNotification, rejectNotification, deleteNotification } from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateJWT, getNotifications);
router.post('/:notificationId/read', authenticateJWT, markAsRead);
router.post('/read-all', authenticateJWT, markAllAsRead);
router.delete('/:notificationId', authenticateJWT, deleteNotification);
router.post('/:notificationId/accept', authenticateJWT, acceptNotification);
router.post('/:notificationId/reject', authenticateJWT, rejectNotification);

export default router;
