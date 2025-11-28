import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Referral from '../models/Referral';
import Application from '../models/Application';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getAllReferrals = async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await Referral.find()
      .populate('seekerId', 'name email')
      .populate('referrerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, referrals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch referrals' });
  }
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find()
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

export const verifyUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { verified: true });
    res.json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify user' });
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { verified: false });
    res.json({ success: true, message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to suspend user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalReferrals, totalApplications] = await Promise.all([
      User.countDocuments(),
      Referral.countDocuments(),
      Application.countDocuments()
    ]);

    const referrers = await User.countDocuments({ role: 'referrer' });
    const seekers = await User.countDocuments({ role: 'seeker' });
    const pendingReferrals = await Referral.countDocuments({ status: 'pending' });
    const completedReferrals = await Referral.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReferrers: referrers,
        totalSeekers: seekers,
        totalReferrals,
        pendingReferrals,
        completedReferrals,
        totalApplications,
        totalRevenue: completedReferrals * 5000
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

export const updateReferralStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { referralId } = req.params;
    const { status } = req.body;
    
    await Referral.findByIdAndUpdate(referralId, { status });
    res.json({ success: true, message: 'Referral status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update referral' });
  }
};

export const sendBulkEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { userIds, subject, message } = req.body;
    // Email sending logic would go here
    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
};

export const getAllPayments = async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await Referral.find({ status: 'completed' })
      .populate('referrerId', 'name email')
      .populate('seekerId', 'name email')
      .sort({ updatedAt: -1 });
    
    const payments = referrals.map(ref => ({
      _id: ref._id,
      referrer: ref.referrerId,
      seeker: ref.seekerId,
      amount: 5000,
      company: ref.company,
      role: ref.role,
      status: 'completed',
      date: ref.updatedAt
    }));
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

export const updateSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = req.body;
    // In production, save to database
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

export const toggleMaintenanceMode = async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = req.body;
    // In production, save to database or config file
    res.json({ success: true, maintenanceMode: enabled });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle maintenance mode' });
  }
};
