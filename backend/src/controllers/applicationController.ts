import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Application from '../models/Application';
import Job from '../models/Job';
import User from '../models/User';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, resumeUrl, coverLetter, aiGenerated, jobTitle, company, status, externalJobId } = req.body;
    const seekerId = req.user?.userId;

    // Handle external jobs (from job search APIs)
    if (externalJobId) {
      const existingApp = await Application.findOne({ seekerId, externalJobId });
      if (existingApp) return res.status(400).json({ error: 'Already applied to this job' });

      const application = new Application({
        seekerId,
        externalJobId,
        jobTitle,
        company,
        status: status || 'applied',
        resumeUrl,
        coverLetter,
        aiGenerated: true,
        appliedAt: new Date()
      });

      await application.save();
      return res.status(201).json({ success: true, application });
    }

    // Handle internal jobs
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const existingApp = await Application.findOne({ jobId, seekerId });
    if (existingApp) return res.status(400).json({ error: 'Already applied to this job' });

    const application = new Application({
      jobId,
      seekerId,
      resumeUrl,
      coverLetter,
      aiGenerated,
      status: 'applied',
      appliedAt: new Date()
    });

    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const bulkApply = async (req: AuthRequest, res: Response) => {
  try {
    const { jobs, autoSubmit, realApply } = req.body;
    const seekerId = req.user?.userId;

    if (!seekerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ error: 'Jobs array is required' });
    }

    console.log(`Bulk apply: ${jobs.length} jobs for user ${seekerId}, realApply: ${realApply}`);

    const results = [];
    const errors = [];

    // Real AI bot application
    if (realApply) {
      const { productionAIBot } = await import('../services/productionAIApplyBot');
      
      try {
        // Check MongoDB connection
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 1) {
          return res.status(503).json({ error: 'Database not connected. Please try again.' });
        }
        
        await productionAIBot.initialize();
        
        const user = await User.findById(seekerId).maxTimeMS(5000);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const userProfile = {
          name: user.name || req.user?.email?.split('@')[0] || 'User',
          email: user.email || req.user?.email || '',
          phone: user.phone || '',
          resumePath: user.resumeUrl,
          linkedinEmail: user.email,
          linkedinPassword: user.linkedinPassword || process.env.LINKEDIN_PASSWORD,
          yearsOfExperience: user.experience || 0,
          currentCompany: user.currentCompany,
          currentTitle: user.currentTitle,
          skills: user.skills
        };

        const botResults = await productionAIBot.bulkApply(jobs, userProfile);
        
        // Save results to database
        for (const result of botResults) {
          if (result.status === 'applied') {
            const application = new Application({
              seekerId,
              externalJobId: result.jobId,
              jobUrl: result.jobUrl,
              jobTitle: result.jobTitle,
              company: result.company,
              status: 'submitted',
              aiGenerated: true,
              appliedAt: new Date()
            });
            await application.save();
            results.push({ jobId: result.jobId, success: true });
          } else {
            errors.push({ jobId: result.jobId, error: result.error });
          }
        }

        await productionAIBot.close();
        
        // Send email notification
        if (results.length > 0) {
          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            }
          });
          
          const jobsList = botResults.filter(r => r.status === 'applied').map(r => `- ${r.jobTitle} at ${r.company}`).join('\n');
          
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `✅ AI Applied to ${results.length} Jobs Successfully!`,
            html: `
              <h2>Your AI Job Applications</h2>
              <p>Great news! Our AI bot has successfully applied to ${results.length} jobs on your behalf.</p>
              <h3>Jobs Applied:</h3>
              <pre>${jobsList}</pre>
              <p>You will receive confirmation emails from the companies directly.</p>
              <p>Best of luck!</p>
            `
          }).catch((err: any) => console.error('Email error:', err));
        }
      } catch (botError: any) {
        console.error('AI Bot error:', botError);
        return res.status(500).json({ error: 'AI bot failed: ' + botError.message });
      }
    } else {
      // Track only (no real application)
      for (const job of jobs) {
        try {
          const existingApp = await Application.findOne({ 
            seekerId, 
            externalJobId: job.job_id 
          });

          if (existingApp) {
            console.log(`Already applied to ${job.job_id}`);
            errors.push({ jobId: job.job_id, error: 'Already applied' });
            continue;
          }

          const application = new Application({
            seekerId,
            externalJobId: job.job_id,
            jobUrl: job.job_apply_link || job.job_google_link,
            jobTitle: job.job_title,
            company: job.employer_name,
            status: 'applied',
            aiGenerated: true,
            appliedAt: new Date()
          });

          await application.save();
          console.log(`Tracked ${job.job_id}`);
          results.push({ jobId: job.job_id, success: true });
        } catch (err: any) {
          console.error(`Error tracking ${job.job_id}:`, err.message);
          errors.push({ jobId: job.job_id, error: err.message || 'Failed to track' });
        }
      }
    }

    console.log(`Bulk apply complete: ${results.length} success, ${errors.length} failed`);

    res.json({ 
      success: true, 
      applied: results.length, 
      failed: errors.length,
      results,
      errors,
      message: realApply ? `AI bot applied to ${results.length} jobs in real!` : 'Applications tracked'
    });
  } catch (error: any) {
    console.error('Bulk apply error:', error);
    res.status(500).json({ error: error.message || 'Failed to process bulk applications' });
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
