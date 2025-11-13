import { Request, Response } from 'express';
import { fetchJobsJsearch } from '../services/linkedinScraper';
import Job from '../models/Job';

export const fetchLiveJobs = async (req: Request, res: Response) => {
  try {
    const { keywords = 'software engineer', location = 'United States' } = req.query;
    const jobs = await fetchJobsJsearch(keywords as string, location as string);
    res.json({ success: true, jobs: jobs || [], count: jobs?.length || 0 });
  } catch (error: any) {
    console.error('Live jobs error:', error);
    res.json({ success: true, jobs: [], count: 0, message: 'No jobs available at the moment' });
  }
};

export const scrapeAndSaveJobs = async (req: Request, res: Response) => {
  try {
    const { keywords = 'software engineer', location = 'United States', limit = 20 } = req.body;
    
    const liveJobs = await fetchJobsJsearch(keywords as string, location as string);
    
    const savedJobs = [];
    for (const job of liveJobs.slice(0, Number(limit))) {
      const existingJob = await Job.findOne({ 
        company: job.employer_name,
        title: job.job_title 
      });
      
      if (!existingJob) {
        const newJob = new Job({
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country || 'Remote',
          type: job.job_employment_type || 'Full-time',
          salary: job.job_salary || 'Competitive',
          description: job.job_description || '',
          requirements: job.job_highlights?.Qualifications || [],
          skills: job.job_required_skills || [],
          benefits: job.job_highlights?.Benefits || [],
          applyUrl: job.job_apply_link,
          referralReward: Math.floor(Math.random() * 400) + 100,
          status: 'active'
        });
        
        await newJob.save();
        savedJobs.push(newJob);
      }
    }
    
    res.json({ 
      message: `Successfully saved ${savedJobs.length} jobs`,
      jobs: savedJobs 
    });
  } catch (error: any) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: error.message || 'Failed to scrape and save jobs' });
  }
};
