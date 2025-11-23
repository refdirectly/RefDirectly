import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Zap, TrendingUp, Clock, CheckCircle, LogOut, Wallet, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import { dashboardApi } from '../services/api';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [orgJobs, setOrgJobs] = useState<any[]>([]);
  const [referralRequests, setReferralRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'referrer') {
      navigate('/referrer/dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchDashboardData();
    
    // Initialize socket
    import('socket.io-client').then(({ io }) => {
      const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`, {
        withCredentials: true,
        auth: { token }
      });
      setSocket(newSocket);
      
      return () => {
        newSocket.close();
      };
    });
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await dashboardApi.getSeeker();
      setDashboardData(data);
      
      // Fetch organization jobs
      const jobsRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/job-postings`);
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        setOrgJobs(jobsData.jobPostings.slice(0, 3));
      }
      
      // Fetch referral requests and chats
      if (token) {
        const [chatsRes, requestsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/chat/chats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/referrals/seeker`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const chatsData = await chatsRes.json();
        const requestsData = await requestsRes.json();
        
        const allRequests = Array.isArray(requestsData) ? requestsData : [];
        setReferralRequests(allRequests);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData({ stats: { activeApplications: 0, referrals: 0, aiApplications: 0, successRate: 0 }, recentActivity: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = [
    { icon: Briefcase, label: 'Active Applications', value: dashboardData?.stats?.activeApplications?.toString() || '0', color: 'text-brand-purple' },
    { icon: Users, label: 'Referrals Received', value: dashboardData?.stats?.referrals?.toString() || '0', color: 'text-brand-magenta' },
    { icon: Zap, label: 'AI Applications', value: dashboardData?.stats?.aiApplications?.toString() || '0', color: 'text-brand-teal' },
    { icon: TrendingUp, label: 'Success Rate', value: `${dashboardData?.stats?.successRate || 0}%`, color: 'text-green-600' },
  ];

  const recentActivity = dashboardData?.recentActivity?.map((activity: any) => ({
    type: activity.type,
    company: activity.jobId?.company || 'Company',
    role: activity.jobId?.title || 'Position',
    status: activity.status,
    time: new Date(activity.createdAt).toLocaleDateString()
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-36 md:pt-44 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 text-center">
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your job search</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors absolute right-4"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => stat.label === 'AI Applications' && navigate('/applications')}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all duration-300 ${
                  stat.label === 'AI Applications' ? 'cursor-pointer hover:scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Referral Requests Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">My Referral Requests</h2>
                {referralRequests.length > 0 ? (
                  <div className="space-y-4">
                    {referralRequests.map((request, index) => {
                      const company = request.company || 'Unknown Company';
                      const role = request.role || 'Unknown Position';
                      const status = request.status || 'pending';
                      
                      return (
                        <React.Fragment key={request._id || index}>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {company.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg">{company}</h3>
                              <p className="text-sm text-gray-600 font-medium">{role}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  status === 'accepted' || status === 'in_progress' ? 'bg-green-100 text-green-700' :
                                  status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>

                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {status === 'accepted' && (
                              <button
                                onClick={() => navigate('/seeker/chat?room=' + request._id)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center gap-2 hover:scale-105"
                              >
                                <MessageCircle className="h-4 w-4" />
                                Open Chat
                              </button>
                            )}
                            {status === 'pending' && (
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Awaiting Response</p>
                                <Clock className="h-4 w-4 text-yellow-500 mx-auto mt-1 animate-pulse" />
                              </div>
                            )}
                            {status === 'rejected' && (
                              <span className="text-xs text-red-600 font-medium">Declined</span>
                            )}
                          </div>
                        </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No referral requests found</p>
                    <p className="text-gray-400 text-sm mb-6">Check browser console for debug info</p>
                    <button
                      onClick={() => navigate('/find-referrer')}
                      className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Find Referrer
                    </button>
                  </div>
                )}
              </motion.div>
              
              {/* Recent Activity Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          {activity.type === 'application' && <Briefcase className="h-5 w-5 text-white" />}
                          {activity.type === 'referral' && <Users className="h-5 w-5 text-white" />}
                          {activity.type === 'ai-apply' && <Zap className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.company}</h3>
                          <p className="text-sm text-gray-600">{activity.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activity.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  )}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-2xl p-8 text-white shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/find-referrer')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">Find Referrer</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5" />
                      <span className="font-semibold">Browse Jobs</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/ai-apply')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      <span className="font-semibold">AI Apply</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/seeker/wallet')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <span className="font-semibold">My Wallet</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/seeker/chat')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">Messages</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {orgJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border-2 border-green-200 mt-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">New Job Postings!</h3>
                      <p className="text-xs text-gray-600">{orgJobs.length} organizations posted jobs</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {orgJobs.map((job, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                        <p className="text-xs text-gray-600">{job.company} • ₹{job.referralReward} referral</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    View All Jobs
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg mt-6"
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Account created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload resume</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Add skills</span>
                  </div>
                </div>
                <div className="mt-4 bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">33% complete</p>
              </motion.div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
