import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, FileText, CheckCircle, Plus, X, Building2, Users, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PostJobPage: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    referralReward: '99'
  });
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to post a job');
      navigate('/auth/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token) {
        alert('Please login to post a job');
        navigate('/auth/login');
        return;
      }

      console.log('Submitting job posting...');

      const payload = {
        ...formData,
        organizationId: userId || 'anonymous',
        requirements: requirements.filter(r => r.trim()),
        referralReward: parseFloat(formData.referralReward) || 99
      };

      console.log('Payload:', payload);

      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`}/api/job-postings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/jobs'), 2000);
      } else {
        alert('Failed to post job: ' + (data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Failed to post job:', error);
      alert('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => setRequirements([...requirements, '']);
  const removeRequirement = (index: number) => setRequirements(requirements.filter((_, i) => i !== index));
  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow pt-32 md:pt-40 pb-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex h-24 w-24 rounded-full bg-green-100 items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
            <p className="text-gray-600 mb-4">Your job posting is now live and visible to job seekers</p>
            <p className="text-sm text-gray-500">Redirecting to jobs page...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Organization Portal</span>
              </div>
              <h1 className="font-display text-5xl font-bold text-gray-900 mb-4">Post a Job Opening</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Reach thousands of qualified candidates and leverage our referral network</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Users, title: '10,000+ Candidates', desc: 'Access our talent pool' },
                { icon: Briefcase, title: 'Referral Network', desc: 'Get quality referrals' },
                { icon: CheckCircle, title: 'Fast Hiring', desc: 'Fill positions quickly' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 shadow-sm"
                >
                  <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-primary items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border-2 border-gray-100"
            >
              <div className="border-l-4 border-brand-purple pl-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details</h2>
                <p className="text-gray-600">Provide information about the position you're hiring for</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Building2 className="h-4 w-4 text-brand-purple" />
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium"
                    placeholder="e.g. Tech Innovations Inc."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Building2 className="h-4 w-4 text-brand-purple" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium"
                    placeholder="e.g. Tech Innovations"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Briefcase className="h-4 w-4 text-brand-purple" />
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium text-lg"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 text-brand-purple" />
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium"
                    placeholder="e.g. Bangalore, India"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Briefcase className="h-4 w-4 text-brand-purple" />
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium"
                    aria-label="Select job type"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign className="h-4 w-4 text-brand-purple" />
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-medium"
                    placeholder="e.g. ₹10-15 LPA"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="h-4 w-4 text-brand-purple" />
                  Job Description
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 leading-relaxed"
                  placeholder="Describe the role, key responsibilities, team structure, and what makes this opportunity unique..."
                />
                <p className="text-sm text-gray-500 mt-2">Be detailed to attract the right candidates</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <CheckCircle className="h-4 w-4 text-brand-purple" />
                    Requirements & Qualifications
                  </label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-sm bg-brand-purple text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-magenta transition-all flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Requirement
                  </button>
                </div>
                <div className="space-y-3">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-brand-purple/10 flex items-center justify-center mt-1">
                        <span className="text-brand-purple font-bold text-sm">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none bg-white transition-all text-gray-900"
                        placeholder="e.g. 3+ years experience in React and Node.js"
                      />
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          aria-label="Remove requirement"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <DollarSign className="h-4 w-4 text-brand-purple" />
                  Referral Reward (₹)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.referralReward}
                    onChange={(e) => setFormData({ ...formData, referralReward: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:border-brand-purple focus:outline-none transition-all text-gray-900 font-bold text-2xl"
                    placeholder="99"
                  />
                  <div className="flex gap-2">
                    {[99, 199, 499].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, referralReward: amt.toString() })}
                        className="px-4 py-2 bg-white border-2 border-purple-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-purple-100 transition-all"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>This amount will be paid to referrers who successfully help you hire a candidate</span>
                </p>
              </div>

              <div className="pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 hover:scale-105 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-5 w-5" />
                      Post Job Opening
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Your job will be visible to 10,000+ candidates immediately
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJobPage;
