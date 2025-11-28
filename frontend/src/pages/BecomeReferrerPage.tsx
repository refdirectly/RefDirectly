import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Shield, Zap, CheckCircle, Users, AlertCircle, Loader2, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn Extra Income',
    description: 'Get paid for successful referrals. Set your own rates and earn on your schedule.',
  },
  {
    icon: Clock,
    title: 'Flexible & Easy',
    description: 'Accept requests when you want. No commitments, work at your own pace.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Escrow protection ensures you get paid once referral is confirmed.',
  },
  {
    icon: Zap,
    title: 'Real-Time Matching',
    description: 'Get instant notifications when someone needs a referral at your company.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Sign Up & Verify',
    description: 'Create your profile and verify your employment at your company.',
  },
  {
    step: 2,
    title: 'Get Matched',
    description: 'Receive real-time notifications when job seekers request referrals at your company.',
  },
  {
    step: 3,
    title: 'Review & Accept',
    description: 'Review the candidate\'s profile and accept if you\'re interested. First to accept gets connected.',
  },
  {
    step: 4,
    title: 'Chat & Discuss',
    description: 'Connect in an anonymous chat room to review resume and discuss the referral.',
  },
  {
    step: 5,
    title: 'Submit Referral',
    description: 'Submit the referral through your company\'s system and confirm completion.',
  },
  {
    step: 6,
    title: 'Get Paid',
    description: 'Once confirmed, payment is automatically released from escrow to your account.',
  },
];

const BecomeReferrerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const organizationDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

  const isOrganizationEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !organizationDomains.includes(domain);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOrganizationEmail(formData.email)) {
      setError('Please use your organization email address (not Gmail, Yahoo, etc.)');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'referrer'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/referrer-dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-24">
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Become a <span className="bg-gradient-primary bg-clip-text text-transparent">Referrer</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Help talented professionals land their dream jobs while earning extra income.
              </p>
              <Link to="/referrer-signup" className="btn btn-primary">
                Start Earning Today
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Become a Referrer?</h2>
              <p className="text-lg text-gray-600">Turn your network into income with our secure platform</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl shadow-subtle border border-gray-100 text-center"
                >
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 mb-4 mx-auto">
                    <benefit.icon className="h-7 w-7 text-brand-blue" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600">Simple steps to start earning as a referrer</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 bg-white p-6 rounded-xl shadow-subtle"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-primary text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal opacity-90"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 rounded-3xl p-12 md:p-16 text-white"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <Users className="h-5 w-5" />
                      <span className="text-sm font-semibold">5,000+ Active Referrers</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      Join Our Referrer Network
                    </h2>
                    <p className="text-xl mb-8 opacity-95 leading-relaxed">
                      Thousands of referrers are already earning. Start making money from your network today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/referrer-signup" className="inline-flex items-center justify-center bg-white text-brand-purple px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl">
                        Sign Up Now
                      </Link>
                      <Link to="/how-it-works" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200">
                        Learn More
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <DollarSign className="h-10 w-10 mb-3" />
                      <div className="text-3xl font-bold mb-1">$2,450</div>
                      <div className="text-sm opacity-90">Avg. Monthly Earnings</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <CheckCircle className="h-10 w-10 mb-3" />
                      <div className="text-3xl font-bold mb-1">92%</div>
                      <div className="text-sm opacity-90">Success Rate</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <Clock className="h-10 w-10 mb-3" />
                      <div className="text-3xl font-bold mb-1">2.5hrs</div>
                      <div className="text-sm opacity-90">Avg. Response Time</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <Zap className="h-10 w-10 mb-3" />
                      <div className="text-3xl font-bold mb-1">24/7</div>
                      <div className="text-sm opacity-90">Real-time Matching</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-subtle"
              >
                <CheckCircle className="h-8 w-8 text-brand-blue mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Real-Time Notifications</h3>
                <p className="text-gray-600 text-sm">Get instant alerts via Socket.io when job seekers request referrals at your company.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-subtle"
              >
                <CheckCircle className="h-8 w-8 text-brand-blue mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">First Come, First Served</h3>
                <p className="text-gray-600 text-sm">First referrer to accept gets connected. Others are automatically notified.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-subtle"
              >
                <CheckCircle className="h-8 w-8 text-brand-blue mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Anonymous Chat</h3>
                <p className="text-gray-600 text-sm">Discuss details in a secure chat room. Share resumes and proof of referral safely.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeReferrerPage;
