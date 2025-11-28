import express from 'express';
import { register, login, googleAuth, googleCallback, linkedinAuth, linkedinCallback, sendSignupOTP, verifySignupOTP } from '../controllers/authController';
import passport from '../config/passport';
import { authMiddleware } from '../utils/auth';
import User from '../models/User';

const router = express.Router();

router.post('/send-otp', sendSignupOTP);
router.post('/verify-otp', verifySignupOTP);
router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
router.get('/linkedin', linkedinAuth);
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false }), linkedinCallback);

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById((req as any).userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;