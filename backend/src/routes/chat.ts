import express from 'express';
import { getChatRoom, getUserChats, sendMessage } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/chats', authMiddleware, getUserChats);
router.get('/:roomId', authMiddleware, getChatRoom);
router.post('/:roomId/message', authMiddleware, sendMessage);

export default router;
