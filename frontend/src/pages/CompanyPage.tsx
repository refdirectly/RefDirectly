import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Users, DollarSign, ExternalLink, Briefcase, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
}

interface Company {
  name: string;
  location: string;
  employees: string;
  industry: string[];
  description: string;
  logo: string;
  annualRevenue: string;
  marketCap: string;
  referralBonus: string;
  careersPage: string;
  jobs: Job[];
}

// Mock data - Replace with actual LinkedIn API integration
const mockCompany: Company = {
  name: 'CVS Health',
  location: 'Rhode Island, United States of America',
  employees: '10K+',
  industry: ['Healthcare', 'Tech'],
  description: 'CVS Health Corporation provides health services in the United States. The company\'s Health Care Benefits segment offers traditional, voluntary, and consumer-directed health insurance products and related services. It serves employer groups, individuals, college students, part-time and hourly workers...',
  logo: 'https://logo.clearbit.com/cvshealth.com',
  annualRevenue: '$10B+',
  marketCap: '$122B+',
  referralBonus: '$5,000',
  careersPage: 'jobs.cvshealth.com',
  jobs: [
    { id: '1', title: 'Software Engineer', department: 'engineering', type: 'Full-time', location: 'Remote' },
    { id: '2', title: 'Product Designer', department: 'design', type: 'Full-time', location: 'Rhode Island' },
    { id: '3', title: 'Data Analyst', department: 'analytics', type: 'Full-time', location: 'Remote' },
    { id: '4', title: 'AI Engineer', department: 'engineering', type: 'Full-time', location: 'Hybrid' },
  ],
};

const CompanyPage: React.FC = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    // Simulate API call - Replace with actual LinkedIn API integration
    const fetchCompanyData = async () => {
      setLoading(true);
      // TODO: Fetch from LinkedIn API
      // const response = await fetch(`/api/companies/${companyId}`);
      setTimeout(() => {
        setCompany(mockCompany);
        setLoading(false);
      }, 1000);
    };

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) return null;

  const filteredJobs = selectedDepartment
    ? company.jobs.filter(job => job.department === selectedDepartment)
    : company.jobs;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 pt-16 md:pt-24">
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-24 w-24 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={company.logo} alt={company.name} className="h-20 w-20 object-contain" />
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                    Get a job referral to {company.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {company.employees} Employees
                    </span>
                    <div className="flex gap-2">
                      {company.industry.map((ind, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link to="/find-referrer" className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
                    Find Referrer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{company.description}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-bold text-gray-900">
                      Jobs ({filteredJobs.length})
                    </h2>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-900"
                      aria-label="Filter jobs by department"
                    >
                      <option value="">All Departments</option>
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                      <option value="analytics">Analytics</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-brand-purple transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {job.department}
                              </span>
                            </div>
                          </div>
                          <Link
                            to="/find-referrer"
                            className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            Get Referral
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to={`https://${company.careersPage}`} target="_blank" className="mt-6 flex items-center justify-center gap-2 text-brand-purple hover:text-brand-magenta transition-colors">
                    View all jobs on careers page
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-4">About</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Careers Page</p>
                      <a href={`https://${company.careersPage}`} target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
                        {company.careersPage}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Financials</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Type</p>
                      <p className="font-semibold text-gray-900">Public</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Annual Revenue</p>
                      <p className="font-semibold text-gray-900">{company.annualRevenue}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Market Cap</p>
                      <p className="font-semibold text-gray-900">{company.marketCap}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-purple to-brand-teal rounded-xl p-6 text-white">
                  <h3 className="font-display text-lg font-bold mb-2">Referrals</h3>
                  <p className="text-sm opacity-90 mb-4">
                    {company.name} accepts referrals. The typical bonus is {company.referralBonus}.
                  </p>
                  <Link to="/signup" className="block w-full bg-white text-brand-purple py-2 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors">
                    Get Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyPage;
