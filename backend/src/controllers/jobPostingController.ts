import { Request, Response } from 'express';
import JobPosting from '../models/JobPosting';

export const createJobPosting = async (req: any, res: Response) => {
  try {
    const { organizationName, title, company, location, type, salary, description, requirements, referralReward } = req.body;
    const organizationId = req.user?.userId;

    const jobPosting = await JobPosting.create({
      organizationId,
      organizationName,
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      referralReward: referralReward || 99
    });

    res.json({ success: true, message: 'Job posted successfully', jobPosting });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveJobPostings = async (req: Request, res: Response) => {
  try {
    const jobPostings = await JobPosting.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, jobPostings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobPostingById = async (req: Request, res: Response) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id);
    
    if (!jobPosting) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, jobPosting });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobPosting = async (req: Request, res: Response) => {
  try {
    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!jobPosting) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job updated successfully', jobPosting });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJobPosting = async (req: Request, res: Response) => {
  try {
    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );

    if (!jobPosting) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job closed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
