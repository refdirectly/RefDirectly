# LinkedIn Job Integration Guide

## Setup Options

### Option 1: RapidAPI (Recommended - Easy & Reliable)

1. **Sign up for RapidAPI**: https://rapidapi.com/
2. **Subscribe to Jsearch API** (Free tier available):
   - Go to: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
   - Subscribe to free plan (2500 requests/month)
   - Copy your API key

3. **Add API key to .env**:
   ```
   RAPIDAPI_KEY=your-actual-key-here
   ```

4. **Test the integration**:
   ```bash
   # Fetch live jobs from LinkedIn/Indeed/Glassdoor
   curl "http://localhost:3001/api/jobs/live?keywords=software+engineer&location=United+States"
   
   # Scrape and save to database
   curl -X POST http://localhost:3001/api/jobs/scrape \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"keywords": "software engineer", "location": "United States"}'
   ```

### Option 2: LinkedIn Official API (Complex)

1. Create LinkedIn App: https://www.linkedin.com/developers/apps
2. Get OAuth credentials
3. Implement OAuth flow
4. Limited access without partnership

### Option 3: Web Scraping (Not Recommended)

- LinkedIn actively blocks scrapers
- Violates LinkedIn Terms of Service
- Use at your own risk

## API Endpoints

### GET /api/jobs/live
Fetch live jobs without saving to database
```
Query params:
- keywords: "software engineer" (default)
- location: "United States" (default)
```

### POST /api/jobs/scrape (Requires Auth)
Scrape jobs and save to database
```json
{
  "keywords": "react developer",
  "location": "San Francisco",
  "source": "jsearch"
}
```

## Frontend Integration

Update JobsPage to fetch live jobs:

```typescript
import { jobsApi } from '../services/api';

// Fetch live LinkedIn jobs
const liveJobs = await fetch('http://localhost:3001/api/jobs/live?keywords=developer');
const data = await liveJobs.json();
```

## Supported Job Boards (via Jsearch)

- LinkedIn
- Indeed
- Glassdoor
- ZipRecruiter
- BeBee
- Google Jobs

## Data Returned

Each job includes:
- job_title
- employer_name
- employer_logo
- job_city, job_country
- job_employment_type
- job_description
- job_required_skills
- job_highlights (Qualifications, Benefits)
- job_apply_link

## Cost

**Jsearch API (RapidAPI)**:
- Free: 2,500 requests/month
- Basic: $9.99/month - 10,000 requests
- Pro: $49.99/month - 100,000 requests

## Alternative Free Options

1. **Adzuna API**: Free tier available
2. **GitHub Jobs API**: Free but deprecated
3. **RemoteOK API**: Free for remote jobs
4. **Arbeitnow API**: Free for EU jobs
