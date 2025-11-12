import express from 'express';
import { getChatRoom, getUserChats } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/chats', authMiddleware, getUserChats);
router.get('/:roomId', authMiddleware, getChatRoom);

export default router;
