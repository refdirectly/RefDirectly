import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Loader2, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { aiJobsApi, jobsApi } from '../services/api';

const AIJobSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    try {
      const data = await aiJobsApi.search(query);
      console.log('AI Search Response:', data);
      if (data.success) {
        setResults(data);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err: any) {
      console.error('AI search failed:', err);
      // Fallback to database jobs
      try {
        const dbJobs = await jobsApi.getAll({ search: query });
        setResults({
          success: true,
          searchParams: { keywords: query, location: 'Database' },
          jobs: dbJobs.map((job: any) => ({
            job_title: job.title,
            employer_name: job.company,
            job_city: job.location,
            job_country: '',
            job_employment_type: job.type,
            employer_logo: job.companyLogo,
            _id: job._id,
            salary: job.salary,
            description: job.description
          })),
          totalFound: dbJobs.length
        });
      } catch (dbErr) {
        setError('Failed to search jobs. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-purple" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'Find me remote React jobs in San Francisco with 100k+ salary'"
            className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>AI understood:</strong> {results.searchParams?.keywords} in {results.searchParams?.location}
            </p>
            <p className="text-sm text-blue-600 mt-1">Found {results.totalFound} jobs{results.searchParams?.location === 'Database' ? ' (from database)' : ''}</p>
          </div>

          <div className="grid gap-4">
            {results.jobs && results.jobs.length > 0 ? (
              results.jobs.slice(0, 10).map((job: any, idx: number) => (
              <div key={job._id || idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  {job.employer_logo && (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={job.employer_logo} alt={job.employer_name} className="h-10 w-10 object-contain" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{job.job_title}</h3>
                    <p className="text-gray-700 font-medium">{job.employer_name}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      {job.job_city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.job_city}{job.job_country && `, ${job.job_country}`}
                        </span>
                      )}
                      {job.job_employment_type && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.job_employment_type}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                    )}
                    <button className="mt-4 bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Find Referrer
                    </button>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">No jobs found. Try a different search.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIJobSearch;
