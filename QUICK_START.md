# Quick Start - LinkedIn Job Integration

## 1. Get RapidAPI Key (2 minutes)

1. Go to https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. Click "Subscribe to Test"
3. Choose FREE plan (2,500 requests/month)
4. Copy your API key from the code snippet

## 2. Add to .env

```bash
cd backend
nano .env
```

Add this line:
```
RAPIDAPI_KEY=your-copied-key-here
```

## 3. Test It

### Fetch Live Jobs (No Auth Required)
```bash
curl "http://localhost:3001/api/jobs/live?keywords=react+developer&location=San+Francisco"
```

### Save Jobs to Database (Requires Login)
```bash
# First login to get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Use the token to scrape and save
curl -X POST http://localhost:3001/api/jobs/scrape \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"keywords":"software engineer","location":"United States"}'
```

## 4. Frontend Usage

Jobs page will automatically show:
- Database jobs (from seed)
- Live LinkedIn/Indeed jobs (when you add toggle)

## Alternative: Free Job APIs (No API Key Needed)

### Adzuna API
```bash
# Sign up: https://developer.adzuna.com/
# Free: 1000 calls/month
```

### RemoteOK API (Completely Free)
```bash
curl https://remoteok.com/api
```

### Arbeitnow API (Free, No Key)
```bash
curl https://www.arbeitnow.com/api/job-board-api
```

## Next Steps

1. Add toggle in JobsPage: "Show Live Jobs" vs "Show Saved Jobs"
2. Add admin panel to scrape and save jobs
3. Schedule automatic job scraping (cron job)
4. Filter by company, salary, remote, etc.
