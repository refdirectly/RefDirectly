import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import passport from '../config/passport';
import OTP from '../models/OTP';
import { sendOTP } from '../services/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'referus-jwt-secret-key-2024-production-change-this';
const JWT_EXPIRES_IN = '7d';

export const sendSignupOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({ 
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60000) } // Last 1 minute
    });
    
    if (recentOTP) {
      return res.status(429).json({ 
        success: false, 
        message: 'Please wait 1 minute before requesting a new OTP' 
      });
    }

    // Delete old OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    await OTP.create({ 
      email: email.toLowerCase(), 
      otp,
      attempts: 0,
      maxAttempts: 3,
      blocked: false
    });
    
    // Send OTP via email with retry logic
    await sendOTP(email, otp);
    
    res.json({ 
      success: true, 
      message: 'OTP sent to your email. Valid for 10 minutes.',
      expiresIn: 600 // seconds
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
};

export const verifySignupOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP format' });
    }

    const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    // Check if blocked due to too many attempts
    if (otpRecord.blocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        otpRecord.blocked = true;
        await otpRecord.save();
        return res.status(403).json({ 
          success: false, 
          message: 'Too many failed attempts. Please request a new OTP.' 
        });
      }
      
      await otpRecord.save();
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${otpRecord.maxAttempts - otpRecord.attempts} attempts remaining.` 
      });
    }
    
    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.json({ 
      success: true, 
      message: 'Email verified successfully',
      verified: true
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'seeker', phone, linkedinPassword, experience, currentCompany, currentTitle, skills, otpVerified } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Require OTP verification for all users
    if (!otpVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email verification required. Please verify your email with OTP first.' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role,
      phone,
      linkedinPassword,
      experience,
      currentCompany,
      currentTitle,
      skills: skills ? skills.split(',').map((s: string) => s.trim()) : [],
      verified: role === 'referrer' ? true : role === 'seeker',
      companies: [],
      createdAt: new Date(),
      lastSeenAt: new Date()
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        verified: user.verified
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    user.lastSeenAt = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        companies: user.companies
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'referus-jwt-secret-key-2024-production-change-this',
    { expiresIn: '7d' }
  );
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, email: user.email, name: user.name, role: user.role }))}`);
};

export const linkedinAuth = passport.authenticate('linkedin');

export const linkedinCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'referus-jwt-secret-key-2024-production-change-this',
    { expiresIn: '7d' }
  );
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, email: user.email, name: user.name, role: user.role }))}`);
};
