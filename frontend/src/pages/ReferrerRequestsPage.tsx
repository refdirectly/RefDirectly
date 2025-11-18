import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Briefcase, Clock, DollarSign, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { referralsApi } from '../services/api';

const ReferrerRequestsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'referrer') {
      navigate('/seeker/dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/referrals/referrer${filter !== 'all' ? `?status=${filter}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setReferrals(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch referrals:', err);
      setError(err.message || 'Failed to load referrals');
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [filter, user]);

  const handleAccept = async (id: string) => {
    try {
      await referralsApi.updateStatus(id, 'accepted');
      fetchReferrals();
    } catch (err: any) {
      console.error('Failed to accept referral:', err);
      setError(err.message || 'Failed to accept referral');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
              Referral Requests
            </h1>
            <p className="text-gray-600">Review and accept referral requests from job seekers</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, role, or skills..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'all' ? 'bg-gradient-primary text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'pending' ? 'bg-gradient-primary text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  filter === 'accepted' ? 'bg-gradient-primary text-white' : 'bg-white text-gray-700 border-2 border-gray-200'
                }`}
              >
                Accepted
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {referrals.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {request.seekerProfile?.name || 'Anonymous Candidate'}
                          </h3>
                          <p className="text-gray-600 text-sm">{request.seekerProfile?.email || 'No email provided'}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {request.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 font-semibold mb-1">REQUESTED</p>
                          <p className="text-sm font-bold text-gray-900">
                            {new Date(request.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 font-semibold mb-1">REWARD</p>
                          <p className="text-xl font-bold text-green-700">₹{request.reward}</p>
                        </div>
                      </div>

                      {request.seekerProfile?.skills?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 mb-2">SKILLS</p>
                          <div className="flex flex-wrap gap-2">
                            {request.seekerProfile.skills.map((skill: string, idx: number) => (
                              <span key={idx} className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {request.seekerProfile?.experience && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">EXPERIENCE</p>
                          <p className="text-sm text-gray-700">{request.seekerProfile.experience}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAccept(request._id)}
                              className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              Accept & Refer
                            </button>
                            <button 
                              onClick={() => referralsApi.updateStatus(request._id, 'rejected').then(fetchReferrals)}
                              className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {request.status === 'accepted' && (
                          <>
                            <button 
                              onClick={() => navigate(`/chat?room=${request.chatRoomId || request._id}`)}
                              className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              💬 Open Chat
                            </button>
                            <button 
                              onClick={() => referralsApi.updateStatus(request._id, 'completed').then(fetchReferrals)}
                              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              Mark Complete
                            </button>
                          </>
                        )}
                        {request.resumeUrl && (
                          <a 
                            href={request.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && referrals.length === 0 && (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">Check back later for new referral opportunities</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferrerRequestsPage;
