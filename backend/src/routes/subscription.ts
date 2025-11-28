import express from 'express';
import { 
  getSubscription, 
  createSubscription, 
  useToken, 
  refundToken, 
  cancelSubscription,
  upgradeSubscription 
} from '../controllers/subscriptionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getSubscription);
router.post('/create', authMiddleware, createSubscription);
router.post('/use-token', authMiddleware, useToken);
router.post('/refund-token', authMiddleware, refundToken);
router.post('/cancel', authMiddleware, cancelSubscription);
router.post('/upgrade', authMiddleware, upgradeSubscription);

export default router;
