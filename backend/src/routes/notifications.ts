import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateJWT, getNotifications);
router.patch('/:notificationId/read', authenticateJWT, markAsRead);
router.patch('/read-all', authenticateJWT, markAllAsRead);

export default router;
