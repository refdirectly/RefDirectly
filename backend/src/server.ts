import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from './config/passport';
import { createReferralHandler } from './sockets/referral';
import { createNotificationHandler } from './sockets/notification';
import { startScheduler } from './utils/scheduler';
import { startEscrowCron } from './utils/escrowCron';
import authRoutes from './routes/auth';
import referralRoutes from './routes/referrals';
import paymentRoutes from './routes/payments';
import matchingRoutes from './routes/matching';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import aiJobRoutes from './routes/aiJobs';
import dashboardRoutes from './routes/dashboard';
import walletRoutes from './routes/wallet';
import jobPostingRoutes from './routes/jobPostings';
import escrowRoutes from './routes/escrow';
import chatRoutes from './routes/chat';
import aiResumeRoutes from './routes/aiResume';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

// Disable helmet completely for maximum compatibility
app.disable('x-powered-by');

// Add explicit headers for Safari/Brave/Mobile compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());

// Rate limiting - more lenient for mobile
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.use(express.json());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai-jobs', aiJobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/job-postings', jobPostingRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai-resume', aiResumeRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/ping', (req, res) => {
  res.status(200).send('pong'); // just a simple response
});
// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  createReferralHandler(io, socket);
  createNotificationHandler(io, socket);
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

export { io };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  startScheduler();
  startEscrowCron();
});