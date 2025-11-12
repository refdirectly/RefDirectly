import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Briefcase, Users, MessageSquare, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Search,
    title: 'Search Company & Role',
    description: 'Enter the company name and job role you\'re interested in. We fetch live job openings from LinkedIn.',
  },
  {
    icon: Users,
    title: 'Find Verified Referrers',
    description: 'We identify registered referrers who work at that company and are available to help.',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Matching',
    description: 'Your request is broadcast via Socket.io to all online referrers. First to accept gets connected.',
  },
  {
    icon: MessageSquare,
    title: 'Anonymous Chat',
    description: 'Connect in a secure chat room to share your resume and discuss the referral details.',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Payment is held in escrow until the referrer confirms submission. You\'re protected.',
  },
];

const FindReferrerPage: React.FC = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      navigate(`/referrers?company=${encodeURIComponent(company)}&role=${encodeURIComponent(role)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your <span className="bg-gradient-primary bg-clip-text text-transparent">Referrer</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Connect with verified employees at your dream company and get referred instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-subtle p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="inline h-4 w-4 mr-1" />
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                      placeholder="e.g., Google, Amazon, Microsoft"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline h-4 w-4 mr-1" />
                      Job Role
                    </label>
                    <input
                      id="role"
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                      placeholder="e.g., Software Engineer, Product Manager"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    <Search className="inline h-5 w-5 mr-2" />
                    Find Referrers
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600">Get matched with referrers in real-time</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 bg-gray-50 p-6 rounded-xl shadow-subtle"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-teal/10">
                      <step.icon className="h-7 w-7 text-brand-blue" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-blue to-brand-teal rounded-2xl p-12 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="h-16 w-16 mx-auto mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Protected by Escrow
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Your payment is held securely until the referral is confirmed. No risk, complete transparency.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/signup" className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Started
                  </Link>
                  <Link to="/how-it-works" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-subtle text-center"
              >
                <Search className="h-10 w-10 text-brand-blue mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Live Job Openings</h3>
                <p className="text-gray-600 text-sm">We fetch current job openings from LinkedIn using public APIs and scraping tools.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 p-6 rounded-xl shadow-subtle text-center"
              >
                <Users className="h-10 w-10 text-brand-blue mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Real-Time Broadcast</h3>
                <p className="text-gray-600 text-sm">Your request is sent via Socket.io to all online referrers at the company instantly.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-xl shadow-subtle text-center"
              >
                <MessageSquare className="h-10 w-10 text-brand-blue mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">First Come, First Served</h3>
                <p className="text-gray-600 text-sm">First referrer to accept gets connected. Others are notified automatically.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FindReferrerPage;
