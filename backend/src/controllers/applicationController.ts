import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import Job from '../models/Job';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, resumeUrl, coverLetter, aiGenerated } = req.body;
    const seekerId = req.user?.userId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const existingApp = await Application.findOne({ jobId, seekerId });
    if (existingApp) return res.status(400).json({ error: 'Already applied to this job' });

    const application = new Application({
      jobId,
      seekerId,
      resumeUrl,
      coverLetter,
      aiGenerated
    });

    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const getApplicationsBySeeker = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ seekerId: req.user?.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
