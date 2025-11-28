import OpenAI from 'openai';
import { fetchJobsJsearch } from './linkedinScraper';

const getOpenAI = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ API key not configured');
  }
  return new OpenAI({ 
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });
};

export const aiJobSearch = async (userQuery: string) => {
  try {
    const openai = getOpenAI();
    // Use OpenAI to parse user's natural language query
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Extract job search parameters from user query. Return JSON with: keywords (job title/role), location, experience_level, job_type (full-time/part-time/contract/remote). If not specified, use reasonable defaults."
        },
        {
          role: "user",
          content: userQuery
        }
      ],
      response_format: { type: "json_object" }
    });

    const searchParams = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Fetch jobs based on AI-parsed parameters
    const jobs = await fetchJobsJsearch(
      searchParams.keywords || userQuery,
      searchParams.location || 'United States'
    );

    // Use AI to rank and filter jobs based on user intent
    let rankedJobs = jobs;
    try {
      rankedJobs = await rankJobsWithAI(jobs, userQuery, searchParams);
    } catch (err) {
      console.log('AI ranking skipped');
    }

    return {
      searchParams,
      jobs: rankedJobs,
      totalFound: jobs.length
    };
  } catch (error) {
    console.error('AI job search error:', error);
    throw error;
  }
};

const rankJobsWithAI = async (jobs: any[], userQuery: string, params: any) => {
  if (jobs.length === 0) return [];

  try {
    const openai = getOpenAI();
    const jobSummaries = jobs.slice(0, 20).map((job, idx) => ({
      index: idx,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      type: job.job_employment_type,
      description: job.job_description?.substring(0, 200)
    }));

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Rank these jobs based on relevance to user query. Return JSON array of indices in order of relevance (most relevant first). Consider job title, company, location, and description match."
        },
        {
          role: "user",
          content: `User query: "${userQuery}"\n\nJobs: ${JSON.stringify(jobSummaries)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const ranking = JSON.parse(completion.choices[0].message.content || '{"indices":[]}');
    const rankedIndices = ranking.indices || ranking.ranked_indices || [];

    return rankedIndices.map((idx: number) => jobs[idx]).filter(Boolean);
  } catch (error) {
    console.error('AI ranking error:', error);
    return jobs;
  }
};

export const generateJobRecommendations = async (userProfile: any) => {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Based on user profile, suggest 3-5 job search queries that would be most relevant. Return JSON array of search queries."
        },
        {
          role: "user",
          content: `User profile: ${JSON.stringify(userProfile)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const recommendations = JSON.parse(completion.choices[0].message.content || '{"queries":[]}');
    return recommendations.queries || [];
  } catch (error) {
    console.error('AI recommendations error:', error);
    return [];
  }
};
