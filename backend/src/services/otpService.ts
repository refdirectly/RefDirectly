import crypto from 'crypto';
import OTP from '../models/OTP';
import { sendOTP } from './emailService';

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createAndSendOTP = async (email: string) => {
  await OTP.deleteMany({ email });

  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    attempts: 0,
    maxAttempts: 3,
    blocked: false
  });

  await sendOTP(email, otp);
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord) {
    throw new Error('OTP not found');
  }

  if (otpRecord.blocked) {
    throw new Error('Too many failed attempts. Please request a new OTP');
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    otpRecord.blocked = true;
    await otpRecord.save();
    throw new Error('Too many failed attempts. Please request a new OTP');
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error('Invalid OTP');
  }

  await OTP.deleteOne({ _id: otpRecord._id });
  return true;
};
