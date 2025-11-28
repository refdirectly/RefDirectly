import axios from 'axios';

interface LinkedInJob {
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
}

// RapidAPI LinkedIn Active Jobs API
export const fetchLinkedInJobs = async (keywords: string, location: string = '', limit: number = 20) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-1h',
      params: {
        offset: '0',
        description_type: 'text'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_LINKEDIN_KEY || '7fa0f86964msh5e3200527f84e4cp1bde09jsn06eb6c8e7e3c',
        'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data || [];
  } catch (error: any) {
    console.error('LinkedIn Active Jobs API error:', error.message);
    throw error;
  }
};

// LinkedIn Active Jobs API
export const fetchLinkedInActiveJobs = async (offset: number = 0) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-1h',
      params: {
        offset: offset.toString(),
        description_type: 'text'
      },
      headers: {
        'x-rapidapi-key': '7fa0f86964msh5e3200527f84e4cp1bde09jsn06eb6c8e7e3c',
        'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data || [];
  } catch (error: any) {
    console.error('LinkedIn Active Jobs API error:', error.message);
    return [];
  }
};

// Jobs Search API (RapidAPI)
export const fetchJobsSearchAPI = async (query: string, location: string = 'United States', limit: number = 20) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jobs-search-api.p.rapidapi.com/getjobs',
      params: {
        query: `${query} in ${location}`,
        limit: limit.toString()
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_LINKEDIN_KEY || '7fa0f86964msh5e3200527f84e4cp1bde09jsn06eb6c8e7e3c',
        'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data || [];
  } catch (error: any) {
    console.error('Jobs Search API error:', error.message);
    return [];
  }
};

// Alternative: Jsearch API (also on RapidAPI)
export const fetchJobsJsearch = async (query: string, location: string = 'United States') => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${query} in ${location}`,
        page: '1',
        num_pages: '1'
      },
      headers: {
        'x-rapidapi-key': '89272c2483mshd4bb70ee0ab1149p1ab30ajsn3c71ca866503',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    if (typeof response.data === 'string') {
      console.error('API returned string:', response.data);
      throw new Error('API returned invalid format');
    }
    
    if (!response.data || !response.data.data) {
      console.error('API response:', response.data);
      return [];
    }
    
    return response.data.data || [];
  } catch (error: any) {
    console.error('Jsearch API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return [];
  }
};

// Scrape without API (basic web scraping - may break if LinkedIn changes)
export const scrapeLinkedInBasic = async (keywords: string) => {
  // Note: LinkedIn blocks most scrapers, use official API or RapidAPI instead
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}`;
  
  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // Basic parsing - LinkedIn will likely block this
    return response.data;
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('LinkedIn scraping blocked. Use official API instead.');
  }
};
