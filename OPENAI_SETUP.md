# OpenAI Job Search Setup

## Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

## Add to .env

```bash
cd backend
nano .env
```

Add:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

## How It Works

### AI-Powered Natural Language Search
Users can search using natural language:
- "Find me remote React jobs in San Francisco with 100k+ salary"
- "Senior Python developer positions in New York"
- "Entry level data science jobs"

### What AI Does:
1. **Parses Query**: Extracts keywords, location, experience level, job type
2. **Fetches Jobs**: Searches LinkedIn/Indeed via RapidAPI
3. **Ranks Results**: Uses AI to rank jobs by relevance to user intent
4. **Returns Best Matches**: Shows top 10 most relevant jobs

## API Endpoints

### POST /api/ai-jobs/search
Natural language job search
```bash
curl -X POST http://localhost:3001/api/ai-jobs/search \
  -H "Content-Type: application/json" \
  -d '{"query": "remote frontend developer jobs in California"}'
```

Response:
```json
{
  "success": true,
  "searchParams": {
    "keywords": "frontend developer",
    "location": "California",
    "job_type": "remote"
  },
  "jobs": [...],
  "totalFound": 45
}
```

### POST /api/ai-jobs/recommendations (Requires Auth)
Get personalized job recommendations
```bash
curl -X POST http://localhost:3001/api/ai-jobs/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "Node.js", "TypeScript"],
    "experience": "3 years",
    "preferences": {"remote": true, "salary_min": 100000}
  }'
```

## Frontend Usage

Jobs page now has "Try AI Search" toggle:
- Normal search: Database jobs
- AI search: Real-time LinkedIn/Indeed jobs with AI ranking

## Cost

**OpenAI GPT-3.5-turbo**:
- $0.0005 per 1K input tokens
- $0.0015 per 1K output tokens
- ~$0.002 per search query
- 500 searches = ~$1

**Free Tier**: $5 credit for new accounts

## Example Queries

- "Software engineer jobs at FAANG companies"
- "Remote full-stack positions paying over 150k"
- "Entry level data analyst roles in tech startups"
- "Senior DevOps engineer with Kubernetes experience"
- "Product manager jobs in fintech"
