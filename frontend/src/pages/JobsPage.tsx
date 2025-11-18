import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Building2, Clock, DollarSign, Filter, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { jobsApi } from '../services/api';
import AIJobSearch from '../components/AIJobSearch';
import ReferralRequestModal from '../components/ReferralRequestModal';

interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  skills: string[];
  referralReward: number;
  createdAt: string;
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralRequests, setReferralRequests] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const fetchReferralData = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      Promise.all([
        fetch(`${API_URL}/api/chat/chats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()),
        fetch(`${API_URL}/api/referrals/seeker`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json())
      ])
        .then(([chatsData, requestsData]) => {
          console.log('=== REFERRAL DATA DEBUG ===');
          console.log('Chat rooms:', chatsData.chats);
          console.log('Referral requests:', requestsData);
          
          const allRequests = [
            ...(chatsData.chats || []),
            ...(Array.isArray(requestsData) ? requestsData : [])
          ];
          
          console.log('Combined requests:', allRequests);
          setReferralRequests(allRequests);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [refreshKey]);

  useEffect(() => {
    // Refresh when modal closes
    const interval = setInterval(() => {
      if (!showReferralModal) {
        fetchReferralData();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [showReferralModal]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        // Fetch organization postings
        const orgResponse = await fetch(`${API_URL}/api/job-postings`);
        const orgResult = await orgResponse.json();
        const orgJobs = (orgResult.jobPostings || []).map((job: any) => ({
          _id: job._id,
          title: job.title,
          company: job.company,
          companyLogo: `https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g, '')}.com`,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description.substring(0, 200) + '...',
          skills: job.requirements || [],
          referralReward: job.referralReward,
          createdAt: job.createdAt,
          organizationId: job.organizationId,
          isOrgPosting: true
        }));

        // Fetch API jobs
        const response = await fetch(`${API_URL}/api/jobs/live?keywords=${encodeURIComponent(searchTerm || 'software engineer')}&location=${encodeURIComponent(locationFilter || 'United States')}`);
        const result = await response.json();
        
        const jobsData = result.jobs || [];
        const getReferralFee = (title: string, company: string) => {
          const titleLower = title.toLowerCase();
          const companyLower = company.toLowerCase();
          
          // Tier 1 companies
          const tier1Companies = ['google', 'microsoft', 'apple', 'amazon', 'meta', 'facebook', 'netflix', 'tesla', 'nvidia', 'salesforce', 'adobe', 'uber', 'airbnb', 'stripe', 'spotify', 'twitter', 'linkedin', 'dropbox', 'slack', 'zoom', 'palantir', 'snowflake'];
          const isTier1 = tier1Companies.some(t1 => companyLower.includes(t1));
          
          if (isTier1) {
            return 399; // Tier 1 companies
          } else if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('staff') || titleLower.includes('architect')) {
            return 299; // Senior level
          } else if (titleLower.includes('junior') || titleLower.includes('intern') || titleLower.includes('entry') || titleLower.includes('associate') || titleLower.includes('trainee')) {
            return 99; // Junior level
          } else {
            return 199; // Mid level
          }
        };

        const formattedJobs = jobsData.map((job: any) => ({
          _id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          companyLogo: job.employer_logo || `https://logo.clearbit.com/${job.employer_name?.toLowerCase().replace(/\s/g, '')}.com`,
          location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country || 'Remote',
          type: job.job_employment_type || 'Full-time',
          salary: job.job_salary || 'Competitive',
          description: (job.job_description || '').substring(0, 200) + '...',
          skills: job.job_required_skills || [],
          referralReward: getReferralFee(job.job_title || '', job.employer_name || ''),
          createdAt: job.job_posted_at_datetime_utc || new Date().toISOString()
        }));
        
        // Combine organization jobs and API jobs
        setJobs([...orgJobs, ...formattedJobs]);
      } catch (err: any) {
        console.error('Failed to fetch jobs:', err);
        setError(err.message || 'Failed to load jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchJobs, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, locationFilter]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === '' || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 pt-24 md:pt-32">
        <section className="py-16 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
                10,000+ Open Roles
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                We've helped countless job seekers land their dream jobs — now it's your turn. Browse thousands of open roles on RefDirectly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setUseAI(!useAI)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {useAI ? 'Switch to Normal Search' : 'Try AI Search'}
                </button>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Job title or company"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-900"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-900"
                    />
                  </div>
                  <button className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {useAI ? (
                <AIJobSearch />
              ) : (
                <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Jobs</h2>
                  <p className="text-gray-600">{jobs.length} jobs found • {jobs.filter((j: any) => j.isOrgPosting).length} organization postings</p>
                </div>
                {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={job.companyLogo} alt={job.company} className="h-12 w-12 object-contain" onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold text-gray-600">${job.company[0]}</span>`;
                            }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-lg text-gray-700 font-semibold mb-3">{job.company}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.type}
                            </span>
                            {job.salary && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{job.description}</p>
                          <div className="flex items-center gap-3">
                            {(() => {
                              const jobCompany = job.company?.toLowerCase().trim();
                              const jobTitle = job.title?.toLowerCase().trim();
                              
                              // Check for chat room (accepted referral)
                              const chatRoom = referralRequests.find(req => {
                                if (!req.referralRequest) return false;
                                const refCompany = req.referralRequest.company?.toLowerCase().trim();
                                const refRole = req.referralRequest.role?.toLowerCase().trim();
                                const refStatus = req.referralRequest.status;
                                
                                const match = refCompany === jobCompany && 
                                             refRole === jobTitle &&
                                             (refStatus === 'accepted' || refStatus === 'in_progress');
                                
                                if (match) {
                                  console.log('✅ CHAT MATCH FOUND:', {
                                    job: { company: jobCompany, title: jobTitle },
                                    request: { company: refCompany, role: refRole, status: refStatus }
                                  });
                                }
                                return match;
                              });
                              
                              if (chatRoom) {
                                return (
                                  <button
                                    onClick={() => navigate(`/chat?room=${chatRoom._id}`)}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                                  >
                                    <MessageCircle className="h-4 w-4" />
                                    Chat with Referrer
                                  </button>
                                );
                              }
                              
                              // Check for pending referral request
                              const pendingRequest = referralRequests.find(req => {
                                if (req.referralRequest) return false;
                                const reqCompany = req.company?.toLowerCase().trim();
                                const reqRole = req.role?.toLowerCase().trim();
                                
                                const match = reqCompany === jobCompany && 
                                             reqRole === jobTitle &&
                                             req.status === 'pending';
                                
                                if (match) {
                                  console.log('⏳ PENDING MATCH FOUND:', {
                                    job: { company: jobCompany, title: jobTitle },
                                    request: { company: reqCompany, role: reqRole, status: req.status }
                                  });
                                }
                                return match;
                              });
                              
                              if (pendingRequest) {
                                return (
                                  <div className="flex items-center gap-2">
                                    <button
                                      disabled
                                      className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
                                    >
                                      <Clock className="h-4 w-4 animate-pulse" />
                                      Pending Approval
                                    </button>
                                  </div>
                                );
                              }
                              
                              return (
                                <button
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setShowReferralModal(true);
                                  }}
                                  className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                                >
                                  Request Referral
                                </button>
                              );
                            })()}
                            {(job as any).isOrgPosting && (
                              <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  ✓ Organization Posting
                                </span>
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Referral: ₹{job.referralReward}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}

                {!loading && jobs.length === 0 && (
                  <div className="text-center py-20">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto mt-4">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {selectedJob && (
        <ReferralRequestModal
          isOpen={showReferralModal}
          onClose={() => {
            setShowReferralModal(false);
            setSelectedJob(null);
            setRefreshKey(prev => prev + 1);
          }}
          job={selectedJob}
        />
      )}
    </div>
  );
};

export default JobsPage;
