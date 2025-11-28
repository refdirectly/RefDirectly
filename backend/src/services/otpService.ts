import crypto from 'crypto';
import OTP from '../models/OTP';
import { sendOTPEmail } from './emailService';

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createAndSendOTP = async (email: string, type: 'signup' | 'login' | 'reset') => {
  // Delete any existing OTPs for this email and type
  await OTP.deleteMany({ email, type });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OTP.create({
    email,
    otp,
    type,
    expiresAt,
    verified: false,
    attempts: 0
  });

  await sendOTPEmail(email, otp, type);
};

export const verifyOTP = async (email: string, otp: string, type: 'signup' | 'login' | 'reset'): Promise<boolean> => {
  const otpRecord = await OTP.findOne({ email, type, verified: false });

  if (!otpRecord) {
    throw new Error('OTP not found or already verified');
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error('OTP has expired');
  }

  if (otpRecord.attempts >= 5) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error('Too many failed attempts. Please request a new OTP');
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error('Invalid OTP');
  }

  otpRecord.verified = true;
  await otpRecord.save();
  return true;
};
