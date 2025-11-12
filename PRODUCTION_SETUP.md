# Production Setup Guide

## Backend Setup

### 1. Seed Database with Real Jobs
```bash
cd backend
npm run seed
```

This will populate your MongoDB with 8 real job postings from companies like Google, Meta, Amazon, Stripe, Microsoft, Netflix, Apple, and Uber.

### 2. Start Backend Server
```bash
npm run dev
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all active jobs (supports filters: search, type, location, skills)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (requires auth)
- `PUT /api/jobs/:id` - Update job (requires auth)
- `DELETE /api/jobs/:id` - Delete job (requires auth)

### Referrals
- `POST /api/referrals` - Create referral request (requires auth)
- `GET /api/referrals/seeker` - Get seeker's referrals (requires auth)
- `GET /api/referrals/referrer` - Get referrer's requests (requires auth, supports status filter)
- `PUT /api/referrals/:id/status` - Update referral status (requires auth)

### Applications
- `POST /api/applications` - Apply to job (requires auth)
- `GET /api/applications/seeker` - Get seeker's applications (requires auth)

## Database Models

### Job Model
- title, company, companyLogo, location, type
- experience, salary, description
- requirements[], skills[], benefits[]
- referralReward, status, applicants, referrals
- timestamps

### Referral Model
- jobId, seekerId, referrerId
- status (pending/accepted/rejected/interview/hired/completed)
- reward, message, resumeUrl
- seekerProfile (name, email, skills, experience)
- timestamps

### Application Model
- jobId, seekerId
- status (applied/reviewing/interview/rejected/accepted)
- resumeUrl, coverLetter, aiGenerated
- timestamps

## Frontend Integration

All pages now fetch real data from the backend:
- Jobs page displays real job listings from database
- Referrer requests page will show actual referral requests
- Applications tracked in database
- Real-time updates via Socket.io

## Next Steps for Production

1. Replace sample jobs with real job postings
2. Integrate with LinkedIn/Indeed APIs for job scraping
3. Add file upload for resumes (already has multer/aws-sdk)
4. Implement payment processing (Stripe already integrated)
5. Add email notifications (nodemailer already installed)
6. Set up proper authentication tokens
7. Configure production environment variables
8. Deploy to cloud (AWS/Heroku/Vercel)
