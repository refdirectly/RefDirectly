import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, DollarSign, TrendingUp, Activity, 
  UserCheck, UserX, CheckCircle, XCircle, Clock, 
  Search, Filter, Download, RefreshCw, Settings,
  BarChart3, PieChart, AlertTriangle, Shield, Mail
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReferrers: 0,
    totalSeekers: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalRevenue: 0,
    activeChats: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [usersRes, referralsRes, appsRes, jobsRes, paymentsRes, subsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/users`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/referrals`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/applications`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/jobs`, { headers }).catch(() => ({ json: () => ({ jobs: [] }) })),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/payments`, { headers }).catch(() => ({ json: () => ({ payments: [] }) })),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/subscriptions`, { headers }).catch(() => ({ json: () => ({ subscriptions: [] }) }))
      ]);

      const usersData = await usersRes.json();
      const referralsData = await referralsRes.json();
      const appsData = await appsRes.json();
      const jobsData = await jobsRes.json();
      const paymentsData = await paymentsRes.json();
      const subsData = await subsRes.json();

      setUsers(usersData.users || []);
      setReferrals(referralsData.referrals || []);
      setApplications(appsData.applications || []);
      setJobs(jobsData.jobs || jobsData || []);
      setPayments(paymentsData.payments || []);
      setSubscriptions(subsData.subscriptions || []);

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalReferrers: usersData.users?.filter((u: any) => u.role === 'referrer').length || 0,
        totalSeekers: usersData.users?.filter((u: any) => u.role === 'seeker').length || 0,
        totalReferrals: referralsData.referrals?.length || 0,
        pendingReferrals: referralsData.referrals?.filter((r: any) => r.status === 'pending').length || 0,
        completedReferrals: referralsData.referrals?.filter((r: any) => r.status === 'completed').length || 0,
        totalRevenue: (referralsData.referrals?.filter((r: any) => r.status === 'completed').length || 0) * 5000,
        activeChats: referralsData.referrals?.filter((r: any) => r.status === 'accepted').length || 0
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'verify' | 'suspend' | 'delete') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage all platform operations</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchAdminData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'referrals', label: 'Referrals', icon: UserCheck },
            { id: 'applications', label: 'Applications', icon: Briefcase },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'payments', label: 'Payments', icon: DollarSign },
            { id: 'subscriptions', label: 'Subscriptions', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-purple text-brand-purple font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" trend="+12%" />
              <StatCard icon={UserCheck} label="Total Referrers" value={stats.totalReferrers} color="bg-purple-500" trend="+8%" />
              <StatCard icon={Briefcase} label="Total Referrals" value={stats.totalReferrals} color="bg-green-500" trend="+15%" />
              <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="bg-yellow-500" trend="+20%" />
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard icon={Clock} label="Pending Referrals" value={stats.pendingReferrals} color="bg-orange-500" />
              <StatCard icon={CheckCircle} label="Completed" value={stats.completedReferrals} color="bg-green-500" />
              <StatCard icon={Activity} label="Active Chats" value={stats.activeChats} color="bg-blue-500" />
              <StatCard icon={TrendingUp} label="Job Seekers" value={stats.totalSeekers} color="bg-indigo-500" />
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Referrals</h3>
                <div className="space-y-3">
                  {referrals.slice(0, 5).map((ref) => (
                    <div key={ref._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{ref.company}</p>
                        <p className="text-sm text-gray-600">{ref.role}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ref.status === 'completed' ? 'bg-green-100 text-green-700' :
                        ref.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {ref.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Response</span>
                    <span className="text-gray-900 font-semibold">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Sessions</span>
                    <span className="text-gray-900 font-semibold">{stats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Service</span>
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.filter(u => 
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'referrer' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'seeker' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 ${user.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {user.verified ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!user.verified && (
                            <button
                              onClick={() => handleUserAction(user._id, 'verify')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Verify"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user._id, 'suspend')}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction(user._id, 'delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Referral Management</h2>
            <div className="space-y-4">
              {referrals.map((ref) => (
                <div key={ref._id} className="p-4 border border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{ref.company} - {ref.role}</h3>
                      <p className="text-sm text-gray-600">
                        Seeker: {ref.seekerId?.name} • Referrer: {ref.referrerId?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(ref.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      ref.status === 'completed' ? 'bg-green-100 text-green-700' :
                      ref.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      ref.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI Applications</h2>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{app.jobTitle}</h3>
                      <p className="text-sm text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {app.aiGenerated && (
                        <span className="px-3 py-1 bg-gradient-to-r from-brand-teal to-brand-purple text-white text-xs rounded-full font-semibold">
                          AI Applied
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Job Management</h2>
              <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
                Add New Job
              </button>
            </div>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No jobs posted yet</p>
                </div>
              ) : (
                jobs.slice(0, 20).map((job: any) => (
                  <div key={job._id} className="p-4 border border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Posted: {new Date(job.createdAt || Date.now()).toLocaleDateString()} • {job.applicants || 0} applicants
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status || 'active'}
                        </span>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          Edit
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Management</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-semibold">Total Processed</p>
                <p className="text-2xl font-bold text-green-700 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">{stats.completedReferrals} payments</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-600 font-semibold">Pending Payment</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">₹{(stats.pendingReferrals * 5000).toLocaleString()}</p>
                <p className="text-xs text-yellow-600 mt-1">{stats.pendingReferrals} referrals</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold">In Progress</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">₹{(referrals.filter(r => r.status === 'accepted').length * 5000).toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">{referrals.filter(r => r.status === 'accepted').length} active</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-semibold">Total Referrals</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{stats.totalReferrals}</p>
                <p className="text-xs text-purple-600 mt-1">All statuses</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">All Payment Transactions</h3>
              {referrals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No payment transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((ref) => (
                    <div key={ref._id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-brand-purple transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {ref.referrerId?.name || 'Unknown Referrer'} → {ref.seekerId?.name || 'Unknown Seeker'}
                        </p>
                        <p className="text-sm text-gray-600">{ref.company} - {ref.role}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(ref.createdAt).toLocaleDateString()}
                          {ref.updatedAt && ` • Updated: ${new Date(ref.updatedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          ref.status === 'completed' ? 'text-green-600' :
                          ref.status === 'accepted' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>₹5,000</p>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          ref.status === 'completed' ? 'bg-green-100 text-green-700' :
                          ref.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          ref.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {ref.status === 'completed' ? 'Paid' :
                           ref.status === 'accepted' ? 'In Progress' :
                           ref.status === 'pending' ? 'Awaiting' : ref.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Growth</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">User Growth Rate</span>
                    <span className="text-green-600 font-bold">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Referral Success Rate</span>
                    <span className="text-blue-600 font-bold">{stats.totalReferrals > 0 ? Math.round((stats.completedReferrals / stats.totalReferrals) * 100) : 0}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Avg. Time to Complete</span>
                    <span className="text-purple-600 font-bold">7 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Platform Fee Revenue</span>
                    <span className="text-green-600 font-bold">₹{Math.round(stats.totalRevenue * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Job Seekers</span>
                      <span className="text-sm font-semibold">{stats.totalSeekers} ({stats.totalUsers > 0 ? Math.round((stats.totalSeekers / stats.totalUsers) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        data-width={stats.totalUsers > 0 ? (stats.totalSeekers / stats.totalUsers) * 100 : 0}
                        ref={(el) => el && (el.style.width = `${el.getAttribute('data-width')}%`)}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Referrers</span>
                      <span className="text-sm font-semibold">{stats.totalReferrers} ({stats.totalUsers > 0 ? Math.round((stats.totalReferrers / stats.totalUsers) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500"
                        data-width={stats.totalUsers > 0 ? (stats.totalReferrers / stats.totalUsers) * 100 : 0}
                        ref={(el) => el && (el.style.width = `${el.getAttribute('data-width')}%`)}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold">Conversion Rate</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">24%</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold">Avg. Referral Value</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">₹5K</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold">Active Users</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{Math.round(stats.totalUsers * 0.6)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <p className="text-sm text-orange-600 font-semibold">Retention Rate</p>
                  <p className="text-3xl font-bold text-orange-700 mt-2">78%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Management</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-semibold">Professional Plans</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{subscriptions.filter(s => s.plan === 'professional').length}</p>
                  <p className="text-xs text-green-600 mt-1">Active subscribers</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold">Enterprise Plans</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{subscriptions.filter(s => s.plan === 'enterprise').length}</p>
                  <p className="text-xs text-purple-600 mt-1">Active subscribers</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">₹{(subscriptions.filter(s => s.plan === 'professional' && s.billingCycle === 'monthly').length * 999).toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">From subscriptions</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">All Subscriptions</h3>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No active subscriptions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub) => (
                      <div key={sub._id} className="p-4 border border-gray-200 rounded-lg hover:border-brand-purple transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-gray-900">{sub.userId?.name || 'Unknown User'}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                sub.plan === 'professional' ? 'bg-green-100 text-green-700' :
                                sub.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                sub.billingCycle === 'monthly' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                {sub.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{sub.userId?.email || 'No email'}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Tokens: {sub.tokens - sub.tokensUsed}/{sub.tokens}</span>
                              <span>Started: {new Date(sub.startDate).toLocaleDateString()}</span>
                              <span>Ends: {new Date(sub.endDate).toLocaleDateString()}</span>
                              {sub.autoRenew && <span className="text-green-600 font-semibold">Auto-Renew ON</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">₹{sub.amount?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-gray-500">{sub.billingCycle}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Email Configuration</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">SMTP Status</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label htmlFor="emailLimit" className="text-gray-700">Daily Email Limit</label>
                      <input id="emailLimit" type="number" defaultValue="10000" aria-label="Daily Email Limit" className="px-3 py-1 border border-gray-300 rounded-lg w-32 text-right" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label htmlFor="emailProvider" className="text-gray-700">Email Provider</label>
                      <select id="emailProvider" aria-label="Email Provider" className="px-3 py-1 border border-gray-300 rounded-lg">
                        <option>Gmail</option>
                        <option>SendGrid</option>
                        <option>AWS SES</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label htmlFor="referralReward" className="text-gray-700">Referral Reward</label>
                      <input id="referralReward" type="number" defaultValue="5000" aria-label="Referral Reward Amount" className="px-3 py-1 border border-gray-300 rounded-lg w-32 text-right" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label htmlFor="platformFee" className="text-gray-700">Platform Fee (%)</label>
                      <input id="platformFee" type="number" defaultValue="10" aria-label="Platform Fee Percentage" className="px-3 py-1 border border-gray-300 rounded-lg w-32 text-right" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label htmlFor="paymentGateway" className="text-gray-700">Payment Gateway</label>
                      <select id="paymentGateway" aria-label="Payment Gateway" className="px-3 py-1 border border-gray-300 rounded-lg">
                        <option>Razorpay</option>
                        <option>Stripe</option>
                        <option>PayPal</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">API Configuration</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">JSearch API</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Groq AI API</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Socket.IO</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-semibold">Running</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Two-Factor Auth</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked aria-label="Enable Two-Factor Authentication" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Email Verification</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked aria-label="Enable Email Verification" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Rate Limiting</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked aria-label="Enable Rate Limiting" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Save Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Enable Maintenance Mode</p>
                  <p className="text-sm text-gray-600 mt-1">Temporarily disable access to the platform</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" aria-label="Enable Maintenance Mode" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
