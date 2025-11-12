import express from 'express';
import { getSeekerDashboard, getReferrerDashboard, getOrganizationDashboard } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/seeker', authMiddleware, getSeekerDashboard);
router.get('/referrer', authMiddleware, getReferrerDashboard);
router.get('/organization', getOrganizationDashboard);

export default router;
