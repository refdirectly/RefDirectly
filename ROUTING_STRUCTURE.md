# Professional Routing Structure

## Route Organization

### Public Routes
```
/                          - Landing page
/about                     - About page
/how-it-works             - How it works page
/testimonials             - Testimonials page
```

### Authentication Routes
```
/auth/login               - Login page (all users)
/auth/signup              - Signup page (all users)
/auth/referrer/login      - Referrer-specific login
/auth/referrer/signup     - Referrer-specific signup
```

### Job Seeker Routes
```
/jobs                     - Browse all jobs
/jobs/:jobId              - Job details page
/referrers                - Browse referrers
/referrers/find           - Find referrer page
/ai-apply                 - AI-powered job application
/seeker/dashboard         - Job seeker dashboard
```

### Referrer Routes
```
/referrer/join            - Become a referrer page
/referrer/dashboard       - Referrer dashboard
/referrer/requests        - Manage referral requests
/referrer/earnings        - View earnings & payouts
```

### Legacy Routes (Backwards Compatibility)
All old routes still work and redirect to new structure:
```
/login                    → /auth/login
/signup                   → /auth/signup
/dashboard                → /seeker/dashboard
/referrer-dashboard       → /referrer/dashboard
/referrer-signup          → /auth/referrer/signup
/referrer-login           → /auth/referrer/login
/referrer-requests        → /referrer/requests
/referrer-earnings        → /referrer/earnings
/become-referrer          → /referrer/join
/find-referrer            → /referrers/find
/company/:companyId       → /jobs/:jobId
```

## Benefits

### 1. Clear Separation
- `/auth/*` - All authentication
- `/seeker/*` - Job seeker features
- `/referrer/*` - Referrer features
- `/jobs/*` - Job-related pages

### 2. Scalability
Easy to add new features:
- `/seeker/profile`
- `/seeker/applications`
- `/referrer/analytics`
- `/admin/*` for admin panel

### 3. SEO Friendly
- Descriptive URLs
- Logical hierarchy
- Easy to understand

### 4. Professional Structure
- Industry standard
- Easy for developers to navigate
- Clear user flow

## Navigation Updates

### Header Links
- **Logged Out**: How It Works, Testimonials, About, Login, Become a Referrer
- **Job Seeker**: Dashboard, Jobs, Referrers, AI Apply
- **Referrer**: Dashboard, Requests, Earnings

### Redirects After Auth
- Job Seeker login → `/seeker/dashboard`
- Referrer login → `/referrer/dashboard`
- Signup → Role-based dashboard

## Future Enhancements

### Admin Routes
```
/admin/dashboard
/admin/users
/admin/jobs
/admin/referrals
/admin/analytics
```

### API Routes (Backend)
```
/api/v1/auth/*
/api/v1/jobs/*
/api/v1/referrals/*
/api/v1/users/*
/api/v1/ai-jobs/*
```

### Profile Routes
```
/seeker/profile
/seeker/settings
/referrer/profile
/referrer/settings
```
