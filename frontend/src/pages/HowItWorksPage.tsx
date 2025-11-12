import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CircleDollarSign, UserCheck, MessageSquare, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: Search,
    title: 'Discover Verified Professionals',
    description: 'Access our network of authenticated employees at Fortune 500 companies. Advanced AI matching connects you with the right referrers instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Escrow Protection',
    description: 'Enterprise-grade payment security with automated escrow. Your funds remain protected until successful referral completion.',
  },
  {
    icon: CircleDollarSign,
    title: 'Automated Fund Release',
    description: 'Smart contract-based payment release upon verified referral submission. Complete transparency with real-time status tracking.',
  },
];

const detailedSteps = [
  {
    icon: UserCheck,
    title: 'Build Your Professional Profile',
    description: 'Create a comprehensive profile showcasing your expertise, achievements, and career aspirations. Our AI optimizes your visibility to relevant referrers.',
  },
  {
    icon: Search,
    title: 'AI-Powered Referrer Matching',
    description: 'Leverage intelligent algorithms to discover verified employees at target companies. Filter by role, department, and success rate.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication Channel',
    description: 'Engage with referrers through our secure messaging platform. Discuss qualifications, expectations, and establish mutual agreement.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected Escrow Transaction',
    description: 'Initiate payment through bank-grade encryption and escrow protection. Funds held securely until milestone completion.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Referral Submission',
    description: 'Referrer submits your application with confirmation tracking. Automatic payment release upon verified submission with full audit trail.',
  },
];

const HowItWorksPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-24">
        <section className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-brand-purple/20"
              >
                <CheckCircle className="h-4 w-4 text-brand-purple" />
                <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">Simple & Secure Process</span>
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                How It Works
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                Streamlined referral process with enterprise-grade security and transparency.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pt-12 pb-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative group"
                  >
                    <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl border-2 border-gray-200 hover:border-brand-purple transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      <div className="absolute -top-6 left-10">
                        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-primary text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <step.icon className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="mt-10">
                        <div className="inline-block bg-gradient-primary/10 text-brand-purple text-xs font-bold px-3 py-1 rounded-full mb-4">
                          STEP {index + 1}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-gray-900 mb-4 leading-tight">{step.title}</h3>
                        <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                        <div className="h-1 w-12 bg-gradient-to-r from-brand-purple to-brand-magenta opacity-30"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Workflow</h2>
              <p className="text-lg text-gray-600">End-to-end referral journey with full transparency</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
              {detailedSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 bg-white p-6 rounded-xl shadow-subtle"
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
                Start Your Journey Today
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join 50,000+ professionals who accelerated their careers through our verified referral network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="btn btn-primary w-full sm:w-auto">
                  Get Started
                </Link>
                <Link to="/" className="btn btn-secondary w-full sm:w-auto">
                  Back to Home
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

export default HowItWorksPage;
