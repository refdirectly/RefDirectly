# RefferAI - AI-Powered Job Referral Platform

RefferAI is a full-stack web application that connects job seekers with verified referrers at top companies through secure, AI-powered matching and escrow payments.

## 🚀 Features

### For Job Seekers
- **AI-Powered Matching**: Smart algorithm matches you with the best referrers
- **Secure Escrow Payments**: Payments held safely until referral is complete
- **Anonymous Communication**: Chat anonymously until you're ready to reveal identity
- **Verified Network**: All referrers are verified employees at top companies

### For Referrers
- **Earn Money**: Get paid for successful referrals
- **Flexible Rates**: Set your own rates and availability
- **Quality Candidates**: Platform ensures high-quality job seekers
- **Easy Verification**: Simple process to verify your employment

### Platform Features
- **Real-time Matching**: Socket.io for instant referral matching
- **Race-condition Safe**: Redis locks prevent double-booking
- **File Uploads**: S3 integration for resumes and documents
- **Admin Dashboard**: Comprehensive admin panel for platform management

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Socket.io** for real-time communication
- **MongoDB** with Mongoose ODM
- **Redis/Upstash** for caching and locks
- **Stripe** for escrow payments
- **OpenAI** for AI matching
- **AWS S3** for file storage

## 📁 Project Structure

```
/
├── frontend-new/          # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   └── public/           # Static assets
├── backend/              # Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── sockets/      # Socket.io handlers
│   │   └── utils/        # Utility functions
│   └── package.json
└── package.json          # Root package.json
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3
S3_BUCKET=your-bucket-name
S3_REGION=your-region
S3_ACCESS_KEY=AKIA_your_access_key
S3_SECRET_KEY=your_secret_key

# Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Stripe account
- OpenAI API key
- AWS S3 bucket
- Redis/Upstash account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ReferAI
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
# Copy and fill the environment variables
cp backend/.env.example backend/.env
```

4. **Start development servers**
```bash
npm start
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

## 📊 Database Models

### User
- Role-based (seeker/referrer/admin)
- Company verification for referrers
- Rating and pricing system

### ReferralRequest
- Job details and requirements
- Status tracking (pending → accepted → completed)
- Payment integration

### ChatRoom
- Anonymous messaging
- Real-time communication
- Message history

### Transaction
- Escrow payment management
- Stripe integration
- Status tracking

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Referrals
- `POST /api/referrals/request` - Create referral request
- `GET /api/referrals/find` - Find available requests
- `GET /api/referrals/:id` - Get request details

### Payments
- `POST /api/payments/initiate` - Create escrow payment
- `POST /api/payments/webhook` - Stripe webhooks
- `POST /api/payments/:id/release` - Release payment

### Matching
- `POST /api/matching/find` - AI-powered matching
- `GET /api/matching/top` - Top referrers

## 🔌 Socket.io Events

### Client → Server
- `create_referral_request` - Create new request
- `referral_request_accept` - Accept request (race-safe)
- `chat_message` - Send chat message
- `join_company_room` - Join company-specific room

### Server → Client
- `referral_request_received` - New request broadcast
- `referral_request_confirmed` - Match confirmed
- `incoming_chat_message` - New chat message
- `referral_request_closed` - Request no longer available

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** on sensitive endpoints
- **Input Validation** and sanitization
- **CORS Protection** with specific origins
- **Helmet.js** for security headers
- **Race Condition Protection** with Redis locks

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests  
cd frontend-new && npm test
```

## 🚀 Deployment

### Replit Deployment

1. **Create new Repl** with Node.js template
2. **Upload project files** to Repl
3. **Set environment variables** in Replit Secrets
4. **Install dependencies**: `npm run install:all`
5. **Start application**: `npm start`

### Production Deployment

For production, consider:
- **Vercel** for frontend
- **Railway/Render** for backend
- **MongoDB Atlas** for database
- **Upstash** for Redis
- **AWS S3** for file storage

## 📈 Monitoring & Analytics

- **Error Tracking**: Integrate Sentry for error monitoring
- **Analytics**: Use PostHog or Google Analytics
- **Performance**: Monitor API response times
- **Business Metrics**: Track conversion rates and user engagement

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Contact**: reach out via the contact form on the platform

---

Built with ❤️ by the RefferAI Team