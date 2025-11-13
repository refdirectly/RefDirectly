import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Upload, CheckCircle, Sparkles, FileText, Clock, MapPin, Briefcase, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { jobsApi, applicationsApi } from '../services/api';

interface Job {
  _id: string;
  company: string;
  title: string;
  type: string;
  location: string;
  salary?: string;
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Apply to hundreds of jobs in minutes, not hours',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart form filling with context-aware responses',
  },
  {
    icon: CheckCircle,
    title: 'High Accuracy',
    description: '99% accuracy in filling application forms',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Reduce application time by 95%',
  },
];

const AIApplyPage: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/jobs/live?keywords=software engineer&location=United States`);
      const result = await response.json();
      
      if (result.success && result.jobs) {
        const formattedJobs = result.jobs.slice(0, 4).map((job: any) => ({
          _id: job.job_id,
          company: job.employer_name,
          title: job.job_title,
          type: job.job_employment_type || 'Full-time',
          location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country || 'Remote',
          salary: job.job_salary || 'Competitive'
        }));
        setAppliedJobs(formattedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        <section className="py-24 md:py-32 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/30"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">AI-Powered Application Assistant</span>
              </motion.div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                AI-Powered Job Applications
              </h1>
              <p className="text-xl md:text-2xl opacity-95 mb-10 leading-relaxed max-w-4xl mx-auto">
                Apply to hundreds of positions in minutes. Our intelligent system analyzes job requirements, tailors your application, and submits everything automatically.
              </p>
              <Link to="/seeker/ai-apply" className="inline-block bg-white text-brand-purple px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-white/20">
                Browse Jobs Now
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2.5 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Live Opportunities</span>
              </motion.div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">Featured Positions</h2>
              <p className="text-lg text-gray-600">Apply instantly with AI-powered automation</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
                {appliedJobs.map((job, index) => {
                  const companyLogos: { [key: string]: string } = {
                    'Google': '🔴', 'Meta': '🔵', 'Amazon': '🟠', 'Apple': '⚫',
                    'Microsoft': '🟦', 'Netflix': '🔴', 'Stripe': '🟣', 'Uber': '⚫'
                  };
                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-white border-2 border-gray-200 rounded-3xl p-6 hover:shadow-2xl hover:border-brand-purple transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {companyLogos[job.company] || '💼'}
                        </div>
                        <span className="bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">AI Ready</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{job.company}</h3>
                      <p className="text-gray-700 font-semibold mb-5 text-base line-clamp-1">{job.title}</p>
                      <div className="space-y-2.5">
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 text-brand-purple" />
                          <span className="font-medium">{job.type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-brand-magenta" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2 text-brand-teal" />
                            <span className="font-medium">{job.salary}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">How AI Apply Works</h2>
              <p className="text-lg text-gray-600">Three simple steps to automate your job applications</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: 1, title: 'Upload Resume', description: 'Upload your resume and our AI will extract all relevant information', icon: Upload },
                  { step: 2, title: 'Select Jobs', description: 'Choose the jobs you want to apply to from our database', icon: FileText },
                  { step: 3, title: 'Auto-Apply', description: 'Our AI fills out applications and submits them automatically', icon: Zap },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-primary text-white font-bold text-2xl mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Why Choose AI Apply?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl text-center"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-primary text-white mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIApplyPage;
