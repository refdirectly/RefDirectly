import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, CheckCircle, Clock, TrendingUp, LogOut, Wallet, DollarSign, Award, MessageCircle, Star, ArrowUpRight, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReferrerDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    completed: 0, 
    earnings: 0, 
    balance: 0,
    totalReferrals: 0,
    successRate: 0,
    avgResponseTime: '0h',
    rating: 0
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const referralsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/referrals/referrer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const referrals = await referralsRes.json();
      
      const pending = referrals.filter((r: any) => r.status === 'pending').length;
      const completed = referrals.filter((r: any) => r.status === 'completed').length;
      const accepted = referrals.filter((r: any) => r.status === 'accepted' || r.status === 'in_progress');
      const rejected = referrals.filter((r: any) => r.status === 'rejected').length;
      const totalReferrals = referrals.length;
      
      const acceptedWithSeeker = accepted.map((ref: any) => ({
        ...ref,
        seekerName: ref.seekerId?.name || 'Job Seeker',
        lastMessage: 'Click to continue conversation',
        unread: Math.random() > 0.5
      }));
      
      // Calculate success rate
      const successRate = totalReferrals > 0 ? Math.round((completed / totalReferrals) * 100) : 0;
      
      // Calculate average response time (mock for now)
      const avgResponseTime = '2h';
      
      // Get user rating
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const rating = userData.rating || 4.5;
      
      setStats({
        pending,
        completed,
        earnings: completed * 5000,
        balance: completed * 5000,
        totalReferrals,
        successRate,
        avgResponseTime,
        rating
      });
      
      setRequests(acceptedWithSeeker.slice(0, 5));
      
      // Recent activity
      const activity = referrals.slice(0, 5).map((ref: any) => ({
        id: ref._id,
        type: ref.status === 'completed' ? 'success' : ref.status === 'accepted' ? 'accepted' : 'pending',
        title: ref.status === 'completed' ? 'Referral Completed' : ref.status === 'accepted' ? 'Request Accepted' : 'New Request',
        description: `${ref.company} - ${ref.role}`,
        time: new Date(ref.createdAt).toLocaleDateString(),
        amount: ref.status === 'completed' ? '₹5,000' : null
      }));
      
      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'Referrer'}!
              </h1>
              <p className="text-gray-600">Manage your referral requests and earnings</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Bell, label: 'Pending Requests', value: stats.pending.toString(), color: 'text-orange-600', bg: 'bg-orange-100', trend: null },
              { icon: CheckCircle, label: 'Completed', value: stats.completed.toString(), color: 'text-green-600', bg: 'bg-green-100', trend: '+12%' },
              { icon: DollarSign, label: 'Total Earnings', value: `₹${stats.earnings.toLocaleString()}`, color: 'text-brand-purple', bg: 'bg-purple-100', trend: '+₹5K' },
              { icon: TrendingUp, label: 'Success Rate', value: `${stats.successRate}%`, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+5%' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-brand-purple to-brand-magenta rounded-2xl p-6 shadow-lg mb-8 text-white"
          >
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Star className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Rating</p>
                  <p className="text-2xl font-bold">{stats.rating} ⭐</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wallet className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Balance</p>
                  <p className="text-2xl font-bold">₹{stats.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900">Active Chats</h2>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {requests.length} Active
                  </span>
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
                  </div>
                ) : requests.length > 0 ? (
                  <div className="space-y-3">
                    {requests.map((req: any) => (
                      <div key={req._id} className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer border-2 border-gray-100 hover:border-brand-purple" onClick={() => navigate('/referrer/chat?room=' + req._id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-bold text-lg">
                              {req.seekerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{req.seekerName}</h3>
                                {req.unread && <span className="h-2 w-2 bg-green-500 rounded-full"></span>}
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{req.company} • {req.role}</p>
                              <p className="text-xs text-gray-500 mt-1">{req.lastMessage}</p>
                            </div>
                          </div>
                          <button className="bg-gradient-to-r from-brand-purple to-brand-magenta text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No active chats</p>
                    <p className="text-sm text-gray-400 mt-2">Accept requests to start chatting</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'success' ? 'bg-green-100' :
                          activity.type === 'accepted' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                          {activity.type === 'success' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           activity.type === 'accepted' ? <Users className="h-5 w-5 text-blue-600" /> :
                           <Bell className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                            {activity.amount && <span className="text-green-600 font-bold">{activity.amount}</span>}
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-2">Your referral activity will appear here</p>
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-2xl p-8 text-white shadow-lg mb-6"
              >
                <h2 className="font-display text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/referrer/requests')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" />
                      <span className="font-semibold">View Requests</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/referrer/wallet')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      <span className="font-semibold">My Wallet</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/referrer/earnings')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">₹</span>
                      <span className="font-semibold">Earnings</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Account created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Wait for referral requests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Complete referrals</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferrerDashboard;
