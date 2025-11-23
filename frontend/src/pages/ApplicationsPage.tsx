import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, Building2, ExternalLink, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/applications/seeker`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = !searchTerm || 
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-36 md:pt-44 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
              My Applications
            </h1>
            <p className="text-gray-600">Track all your job applications in one place</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === 'all' ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('applied')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === 'applied' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Applied
                </button>
                <button
                  onClick={() => setFilter('interview')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === 'interview' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Interview
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Start applying to jobs to see them here'}
              </p>
              <button
                onClick={() => navigate('/ai-apply')}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Applying
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 hover:border-brand-purple"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                        {(app.company || app.jobId?.company || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {app.jobTitle || app.jobId?.title || 'Job Position'}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">{app.company || app.jobId?.company || 'Company'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                          </div>
                          {app.aiGenerated && (
                            <span className="px-2 py-1 bg-gradient-to-r from-brand-teal to-brand-purple text-white text-xs rounded-full font-semibold">
                              AI Applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {(app.jobUrl || app.externalJobId) && (
                        <button
                          onClick={() => {
                            const url = app.jobUrl || `https://www.google.com/search?q=${encodeURIComponent(`${app.jobTitle} ${app.company} job`)}`;
                            window.open(url, '_blank');
                          }}
                          className="text-brand-purple hover:text-brand-magenta transition-colors flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {app.jobUrl ? 'View Job' : 'Search Job'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {!loading && applications.length > 0 && (
            <div className="mt-8 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4">Application Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/80 text-sm">Total</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Applied</p>
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === 'applied' || a.status === 'submitted').length}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Interview</p>
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === 'interview').length}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">AI Applied</p>
                  <p className="text-2xl font-bold">{applications.filter(a => a.aiGenerated).length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationsPage;
