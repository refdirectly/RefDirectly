import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Briefcase, CheckCircle, Zap, Users, Shield } from 'lucide-react';

const SeekerSignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    setError('');
    setSuccess('');
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOtpSent(true);
      setSuccess('OTP sent! Check your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError('');
    setSuccess('');
    if (!otp || otp.length !== 6) {
      setError('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOtpVerified(true);
      setSuccess('✓ Email verified!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpVerified) {
      setError('Please verify your email with OTP first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'seeker',
          otpVerified: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/seeker/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Users, text: 'Access 5,000+ verified referrers' },
    { icon: Zap, text: 'AI-powered job applications' },
    { icon: Shield, text: 'Secure escrow payment protection' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white hidden lg:block"
            >
              <Link to="/" className="inline-block mb-8">
                <img src="/logo.png" alt="RefferUs" className="h-20 w-auto brightness-0 invert" />
              </Link>
              <h1 className="font-display text-5xl font-bold mb-6">
                Land Your Dream Job
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of job seekers who found their dream careers through verified employee referrals.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <span className="text-lg">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-primary mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h2>
                <p className="text-gray-600">Start your job search journey today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={otpVerified}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all disabled:bg-gray-100"
                      placeholder="you@example.com"
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={loading || !formData.email}
                        className="px-6 py-3 bg-brand-purple text-white rounded-xl font-semibold hover:bg-brand-magenta transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                    {otpVerified && (
                      <div className="flex items-center px-4 py-3 bg-green-100 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
                {otpSent && !otpVerified && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all text-center text-2xl tracking-widest font-bold"
                        placeholder="000000"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        disabled={loading || otp.length !== 6}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Check your email for the 6-digit OTP</p>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>By signing up, you agree to our Terms of Service and Privacy Policy.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-gray-600 pt-4">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="font-semibold text-brand-purple hover:text-brand-magenta transition-colors">
                    Sign in
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerSignupPage;
