import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import Referral from '../models/Referral';
import Job from '../models/Job';
import JobPosting from '../models/JobPosting';

export const getSeekerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const [applications, referrals, totalJobs] = await Promise.all([
      Application.find({ seekerId: userId }).populate('jobId').sort({ createdAt: -1 }),
      Referral.find({ seekerId: userId }).populate('jobId').sort({ createdAt: -1 }),
      Job.countDocuments({ status: 'active' })
    ]);

    const stats = {
      activeApplications: applications.filter(a => ['applied', 'reviewing'].includes(a.status)).length,
      totalApplications: applications.length,
      referrals: referrals.length,
      aiApplications: applications.filter(a => a.aiGenerated).length,
      successRate: applications.length > 0 
        ? Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100)
        : 0,
      totalJobs
    };

    const recentActivity = [
      ...applications.slice(0, 5).map(app => ({
        type: app.aiGenerated ? 'ai-apply' : 'application',
        jobId: app.jobId,
        status: app.status,
        createdAt: app.createdAt
      })),
      ...referrals.slice(0, 3).map(ref => ({
        type: 'referral',
        jobId: ref.jobId,
        status: ref.status,
        createdAt: ref.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    res.json({
      success: true,
      stats,
      recentActivity,
      applications: applications.slice(0, 10),
      referrals: referrals.slice(0, 10)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getReferrerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const referrals = await Referral.find({ referrerId: userId })
      .populate('jobId')
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });

    const stats = {
      pendingRequests: referrals.filter(r => r.status === 'pending').length,
      completedReferrals: referrals.filter(r => r.status === 'completed').length,
      totalEarnings: referrals
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.reward, 0),
      successRate: referrals.length > 0
        ? Math.round((referrals.filter(r => ['hired', 'completed'].includes(r.status)).length / referrals.length) * 100)
        : 0
    };

    res.json({
      success: true,
      stats,
      recentRequests: referrals.slice(0, 10)
    });
  } catch (error) {
    console.error('Referrer dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getOrganizationDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.query.userId;

    const jobPostings = await JobPosting.find({ organizationId: userId })
      .sort({ createdAt: -1 });

    const stats = {
      totalJobs: jobPostings.length,
      activeJobs: jobPostings.filter(j => j.status === 'active').length,
      closedJobs: jobPostings.filter(j => j.status === 'closed').length
    };

    res.json({
      success: true,
      stats,
      jobPostings
    });
  } catch (error) {
    console.error('Organization dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};
