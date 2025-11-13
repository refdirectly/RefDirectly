import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize job referrals and make career opportunities accessible to everyone through verified connections.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a trusted network where job seekers and referrers can connect authentically and transparently.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Ensuring every transaction is secure with escrow protection and verified professional profiles.',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Leveraging artificial intelligence to match job seekers with the most relevant referrers efficiently.',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-24">
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About <span className="bg-gradient-primary bg-clip-text text-transparent">RefDirectly</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Transforming the way people find jobs through trusted referrals and AI-powered connections.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  RefDirectly was born from a simple observation: getting a job referral shouldn't be about who you know, but about your skills and potential. We recognized that talented professionals often struggle to break into top companies simply because they lack connections.
                </p>
                <p className="text-gray-600 mb-4">
                  At the same time, employees at these companies want to help and earn referral bonuses, but lack a trusted platform to connect with qualified candidates. We built RefDirectly to bridge this gap.
                </p>
                <p className="text-gray-600">
                  Our platform combines AI-powered matching with secure escrow payments to create a transparent, trustworthy marketplace for job referrals. Every referrer is verified, every payment is protected, and every connection is meaningful.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-subtle border border-gray-100"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 mb-6">
                    <value.icon className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join Our Community
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Be part of a growing network of professionals helping each other succeed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="btn btn-primary w-full sm:w-auto">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="btn btn-secondary w-full sm:w-auto">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
