import { Request, Response } from 'express';
import { fetchLinkedInJobs, fetchJobsJsearch, fetchJobsSearchAPI } from '../services/linkedinScraper';
import Job from '../models/Job';

export const scrapeAndSaveJobs = async (req: Request, res: Response) => {
  try {
    const { keywords, location, source = 'jsearch' } = req.body;

    let jobs;
    if (source === 'linkedin') {
      jobs = await fetchLinkedInJobs(keywords, location);
    } else {
      jobs = await fetchJobsJsearch(keywords, location);
    }

    const savedJobs = [];
    for (const job of jobs) {
      const newJob = await Job.create({
        title: job.job_title || job.title,
        company: job.employer_name || job.company,
        companyLogo: job.employer_logo || `https://logo.clearbit.com/${(job.employer_name || job.company).toLowerCase().replace(/\s/g, '')}.com`,
        location: job.job_city || job.job_country || job.location || 'Remote',
        type: job.job_employment_type || 'Full-time',
        experience: job.job_required_experience?.required_experience_in_months 
          ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)}+ years` 
          : '2+ years',
        salary: job.job_salary || job.salary_range,
        description: job.job_description || job.description || 'No description available',
        requirements: job.job_highlights?.Qualifications || [],
        skills: job.job_required_skills || [],
        benefits: job.job_highlights?.Benefits || [],
        referralReward: Math.floor(Math.random() * 2000) + 3000,
        status: 'active'
      });
      savedJobs.push(newJob);
    }

    res.json({ 
      success: true, 
      message: `Scraped and saved ${savedJobs.length} jobs`,
      jobs: savedJobs 
    });
  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to scrape jobs' 
    });
  }
};

export const fetchLiveJobs = async (req: Request, res: Response) => {
  try {
    const { keywords = 'software engineer', location = 'United States' } = req.query;
    
    // Use Jsearch API (reliable)
    const jobs = await fetchJobsJsearch(keywords as string, location as string);
    
    res.json({ 
      success: true, 
      count: jobs?.length || 0,
      jobs: jobs || []
    });
  } catch (error: any) {
    console.error('Live jobs error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to fetch jobs'
    });
  }
};
