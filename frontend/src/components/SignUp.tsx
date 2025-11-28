import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle, User, Building2 } from 'lucide-react';

const SignUp: React.FC = () => {
  const [userType, setUserType] = useState<'seeker' | 'referrer' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
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

  const organizationDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  const isOrganizationEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !organizationDomains.includes(domain);
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
      setSuccess('OTP sent to your email!');
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
      setError('Please enter 6-digit OTP');
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
      setSuccess('Email verified! You can now complete signup.');
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

    if (userType === 'referrer' && !isOrganizationEmail(formData.email)) {
      setError('Referrers must use organization email (not Gmail, Yahoo, etc.)');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType || 'seeker',
          otpVerified: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'referrer' ? '/referrer/dashboard' : '/seeker/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join RefDirectly
            </h2>
            <p className="text-xl text-gray-600">
              Choose how you want to get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/auth/signup/seeker">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-brand-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center mb-6 mx-auto">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 text-center">Job Seeker</h3>
              <p className="text-gray-600 text-center mb-6">
                Looking for referrals to land your dream job
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Find verified referrers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">AI-powered job applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Secure escrow payments</span>
                </li>
              </ul>
                <button className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  Sign Up as Job Seeker
                </button>
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => navigate('/referrer-signup')}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-brand-teal cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-magenta flex items-center justify-center mb-6 mx-auto">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 text-center">Referrer</h3>
              <p className="text-gray-600 text-center mb-6">
                Earn money by referring talented candidates
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Earn extra income</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Real-time notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Flexible schedule</span>
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-brand-teal to-brand-magenta text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Sign Up as Referrer
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => navigate('/admin/login')}
              className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-8 shadow-xl border-2 border-gray-700 hover:border-purple-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3 text-center">Admin</h3>
              <p className="text-gray-300 text-center mb-6">
                Manage platform operations and users
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Full platform control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Analytics & insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">User management</span>
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Admin Portal
              </button>
            </motion.div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-brand-purple hover:text-brand-magenta transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <motion.div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <button
              onClick={() => setUserType(null)}
              className="text-sm text-gray-600 hover:text-brand-purple transition-colors mb-6"
            >
              ← Back to selection
            </button>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-primary mb-4">
                {userType === 'referrer' ? <Building2 className="h-8 w-8 text-white" /> : <User className="h-8 w-8 text-white" />}
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                {userType === 'referrer' ? 'Sign Up as Referrer' : 'Create Your Account'}
              </h2>
              <p className="text-gray-600">
                {userType === 'referrer' ? 'Use your organization email' : 'Join the referral network'}
              </p>
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
                  {userType === 'referrer' ? 'Organization Email' : 'Email Address'} <span className="text-red-500">*</span>
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
                    placeholder={userType === 'referrer' ? 'john@company.com' : 'you@example.com'}
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
                {userType === 'referrer' && (
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Must be a company email (not Gmail, Yahoo, etc.)
                  </p>
                )}
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
              {userType === 'referrer' && (
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    placeholder="Google, Meta, Amazon..."
                  />
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
                <span>Password must be at least 6 characters</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? 'Creating Account...' : userType === 'referrer' ? 'Sign Up as Referrer' : 'Create Account'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-brand-purple hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/linkedin`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-brand-purple hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  <svg className="h-5 w-5" fill="#0077B5" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
              <p className="text-center text-sm text-gray-600 pt-4">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-semibold text-brand-purple hover:text-brand-magenta transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
