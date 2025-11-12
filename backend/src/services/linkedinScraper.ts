import axios from 'axios';

interface LinkedInJob {
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
}

// RapidAPI LinkedIn Scraper
export const fetchLinkedInJobs = async (keywords: string, location: string = '', limit: number = 20) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://linkedin-data-api.p.rapidapi.com/search-jobs',
      params: {
        keywords,
        locationId: location || '92000000',
        datePosted: 'anyTime',
        sort: 'mostRelevant'
      },
      headers: {
        'x-rapidapi-key': '7fa0f86964msh5e3200527f84e4cp1bde09jsn06eb6c8e7e3c',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('LinkedIn API error:', error);
    throw error;
  }
};

// Alternative: Jsearch API (also on RapidAPI)
export const fetchJobsJsearch = async (query: string, location: string = 'United States') => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${query} jobs in ${location}`,
        page: '1',
        num_pages: '1',
        country: 'us',
        date_posted: 'all'
      },
      headers: {
        'x-rapidapi-key': '7fa0f86964msh5e3200527f84e4cp1bde09jsn06eb6c8e7e3c',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    if (typeof response.data === 'string') {
      throw new Error('API returned non-JSON response');
    }
    
    return response.data.data || [];
  } catch (error: any) {
    console.error('Jsearch API error:', error.response?.data || error.message);
    throw new Error('API unavailable');
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
