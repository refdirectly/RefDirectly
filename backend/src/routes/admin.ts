import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import User from '../models/User';
import {
  getAllUsers,
  getAllReferrals,
  getAllApplications,
  verifyUser,
  suspendUser,
  deleteUser,
  getStats,
  updateReferralStatus,
  sendBulkEmail,
  getAllPayments,
  updateSystemSettings,
  toggleMaintenanceMode
} from '../controllers/adminController';

const router = express.Router();

// Delete specific user (temporary endpoint for setup)
router.post('/delete-user', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (email !== 'refdirectly@gmail.com') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const result = await User.deleteOne({ email });
    res.json({ success: true, message: `Deleted ${result.deletedCount} user(s)` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Promote user to admin (restricted to refdirectly@gmail.com only)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Only allow refdirectly@gmail.com to be admin
    if (email !== 'refdirectly@gmail.com') {
      return res.status(403).json({ error: 'Access denied. Only authorized email can be admin.' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = 'admin';
    user.verified = true;
    await user.save();
    
    res.json({ success: true, message: 'User promoted to admin', user: { email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Apply auth and admin middleware to all routes below
router.use(authMiddleware);
router.use(adminMiddleware);

// User management
router.get('/users', getAllUsers);
router.post('/users/:userId/verify', verifyUser);
router.post('/users/:userId/suspend', suspendUser);
router.post('/users/:userId/delete', deleteUser);

// Referral management
router.get('/referrals', getAllReferrals);
router.post('/referrals/:referralId/status', updateReferralStatus);

// Application management
router.get('/applications', getAllApplications);

// Stats
router.get('/stats', getStats);

// Payments
router.get('/payments', getAllPayments);

// Subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const Subscription = (await import('../models/Subscription')).default;
    const subscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ subscriptions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Settings
router.post('/settings', updateSystemSettings);
router.post('/maintenance', toggleMaintenanceMode);

// Bulk operations
router.post('/bulk-email', sendBulkEmail);

export default router;
