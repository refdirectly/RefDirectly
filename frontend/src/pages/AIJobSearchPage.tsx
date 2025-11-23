import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Briefcase, MapPin, DollarSign, Clock, Building2, Zap, Target, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_employment_type?: string;
  job_salary?: string;
  job_posted_at_datetime_utc?: string;
  job_description?: string;
}

const AIJobSearchPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [applyingJobs, setApplyingJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [botStatus, setBotStatus] = useState<string>('');
  const [aiSuggestions] = useState([
    'Senior Software Engineer with React experience',
    'Product Manager in tech startups',
    'Data Scientist with Python and ML',
    'Full Stack Developer remote positions'
  ]);

  useEffect(() => {
    loadAppliedJobs();
  }, []);

  const loadAppliedJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/applications/seeker`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const applications = await response.json();
      const appliedIds = new Set(applications.map((app: any) => app.externalJobId).filter(Boolean));
      setAppliedJobs(appliedIds);
    } catch (error) {
      console.error('Failed to load applied jobs:', error);
    }
  };

  useEffect(() => {
    fetchInitialJobs();
  }, []);

  const fetchInitialJobs = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/jobs/live?keywords=software engineer&location=United States&num_pages=2`);
      const result = await response.json();
      if (result.success && result.jobs) {
        setJobs(result.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/jobs/live?keywords=${encodeURIComponent(aiQuery)}&location=United States&num_pages=2`);
      const result = await response.json();
      if (result.success && result.jobs) {
        setJobs(result.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAiQuery(suggestion);
    setTimeout(() => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const keywords = suggestion.toLowerCase();
      setLoading(true);
      fetch(`${API_URL}/api/jobs/live?keywords=${encodeURIComponent(keywords)}&location=United States&num_pages=2`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.jobs) {
            setJobs(result.jobs);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 100);
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const handleAIApply = async (job: Job) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to apply');
      return;
    }

    setApplyingJobs(prev => new Set(prev).add(job.job_id));
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          externalJobId: job.job_id,
          jobTitle: job.job_title,
          company: job.employer_name,
          status: 'applied'
        })
      });

      if (response.ok) {
        setAppliedJobs(prev => new Set(prev).add(job.job_id));
      }
    } catch (error) {
      console.error('Failed to apply:', error);
    } finally {
      setApplyingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.job_id);
        return newSet;
      });
    }
  };

  const handleAutoApplyAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to apply');
      return;
    }

    const unappliedJobs = jobs.filter(job => !appliedJobs.has(job.job_id)).slice(0, 10);
    
    if (unappliedJobs.length === 0) {
      alert('ℹ️ All jobs already applied!\n\nSearch for different jobs (e.g., "Product Manager", "Data Scientist") to find new opportunities.');
      return;
    }

    setLoading(true);
    setBotStatus('🤖 AI Bot initializing...');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log('Applying to jobs:', unappliedJobs.length);
      setBotStatus(`🔍 Searching ${unappliedJobs.length} jobs...`);
      
      const minimalJobs = unappliedJobs.map(job => ({
        job_id: job.job_id,
        job_title: job.job_title,
        employer_name: job.employer_name
      }));
      
      const response = await fetch(`${API_URL}/api/applications/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobs: minimalJobs, autoSubmit: true, realApply: true })
      });

      setBotStatus('📝 AI Bot applying...');
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Result:', result);
      setBotStatus('✅ Complete!');
      
      if (result.success) {
        if (result.applied === 0) {
          alert(`ℹ️ All jobs already applied!\n\nYou've already applied to these jobs. Search for new jobs to apply.`);
        } else {
          result.results.forEach((r: any) => {
            if (r.success) {
              setAppliedJobs(prev => new Set(prev).add(r.jobId));
            }
          });
          alert(`✅ AI Applied to ${result.applied} jobs!\n\n${result.message || 'Applications submitted automatically using AI'}`);
        }
      } else {
        alert(result.error || 'Failed to apply');
      }
    } catch (error: any) {
      console.error('Bulk apply failed:', error);
      setBotStatus('❌ Failed');
      alert(`Error: ${error.message || 'Failed to auto-apply. Please try again.'}`);
    } finally {
      setLoading(false);
      setTimeout(() => setBotStatus(''), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">AI-Powered Job Search</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Perfect Match
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Describe your ideal role in natural language. Our AI understands and finds the best matches.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex gap-3">
                <div className="flex-grow relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                    placeholder="e.g., Senior React Developer with 5+ years experience in fintech..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={handleAISearch}
                  disabled={loading}
                  className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  AI Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Try:</span>
                {aiSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-sm bg-gray-100 hover:bg-gradient-primary hover:text-white text-gray-700 px-3 py-1.5 rounded-full transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Target, label: 'Smart Matching', value: '98% Accuracy' },
                { icon: TrendingUp, label: 'Success Rate', value: '92% Hired' },
                { icon: Zap, label: 'Apply Speed', value: '10x Faster' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-4 border-2 border-gray-100 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-primary text-white flex items-center justify-center">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Searching...' : `${jobs.length} AI-Matched Jobs`}
                </h2>
                {jobs.length > 0 && (
                  <button
                    onClick={handleAutoApplyAll}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Zap className="h-5 w-5" />
                    AI Auto-Apply to 10 Jobs
                  </button>
                )}
              </div>
              {botStatus && (
                <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {botStatus}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent mb-4"></div>
                <p className="text-gray-600">AI is analyzing and matching jobs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.job_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-brand-purple hover:shadow-xl transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {job.employer_logo ? (
                          <img src={job.employer_logo} alt={job.employer_name} className="h-14 w-14 rounded-xl object-cover" />
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                            {job.employer_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                              {job.job_title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <Building2 className="h-4 w-4" />
                              <span className="font-semibold">{job.employer_name}</span>
                            </div>
                          </div>
                          <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            AI Match
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          {(job.job_city || job.job_state) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country}</span>
                            </div>
                          )}
                          {job.job_employment_type && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.job_employment_type}</span>
                            </div>
                          )}
                          {job.job_salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.job_salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{getTimeAgo(job.job_posted_at_datetime_utc)}</span>
                          </div>
                        </div>
                        {job.job_description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {job.job_description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                          </p>
                        )}
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleAIApply(job)}
                            disabled={applyingJobs.has(job.job_id) || appliedJobs.has(job.job_id)}
                            className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {applyingJobs.has(job.job_id) ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                AI Applying...
                              </>
                            ) : appliedJobs.has(job.job_id) ? (
                              '✓ AI Applied'
                            ) : (
                              'AI Apply Now'
                            )}
                          </button>
                          <button className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:border-brand-purple hover:text-brand-purple transition-all duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIJobSearchPage;
