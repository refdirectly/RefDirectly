import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Star, CheckCircle, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReferralPayment from '../components/ReferralPayment';

interface Referrer {
  id: string;
  name: string;
  company: string;
  role: string;
  location: string;
  rating: number;
  referrals: number;
  verified: boolean;
  avatar: string;
}

const mockReferrers: Referrer[] = [
  { id: '1', name: 'Sarah Johnson', company: 'Google', role: 'Senior Software Engineer', location: 'Mountain View, CA', rating: 4.9, referrals: 45, verified: true, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Michael Chen', company: 'Amazon', role: 'Product Manager', location: 'Seattle, WA', rating: 4.8, referrals: 38, verified: true, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Emily Rodriguez', company: 'Microsoft', role: 'Data Scientist', location: 'Redmond, WA', rating: 5.0, referrals: 52, verified: true, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'David Kim', company: 'Apple', role: 'UX Designer', location: 'Cupertino, CA', rating: 4.7, referrals: 31, verified: true, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Jessica Martinez', company: 'Meta', role: 'Engineering Manager', location: 'Menlo Park, CA', rating: 4.9, referrals: 47, verified: true, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'James Wilson', company: 'Netflix', role: 'DevOps Engineer', location: 'Los Gatos, CA', rating: 4.8, referrals: 29, verified: true, avatar: 'https://i.pravatar.cc/150?img=6' },
];

const ReferrersPage: React.FC = () => {
  const [referrers] = useState<Referrer[]>(mockReferrers);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);

  const filteredReferrers = referrers.filter(referrer => {
    const matchesSearch = referrer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referrer.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = companyFilter === '' || referrer.company.toLowerCase().includes(companyFilter.toLowerCase());
    return matchesSearch && matchesCompany;
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
                800+ Assigned Referrals
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Our network is thousands strong and growing. Get referred by employees from 5000+ companies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by name or role"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-900"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Company"
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReferrers.map((referrer, index) => (
                  <motion.div
                    key={referrer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img src={referrer.avatar} alt={referrer.name} className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{referrer.name}</h3>
                          {referrer.verified && (
                            <CheckCircle className="h-4 w-4 text-brand-teal" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{referrer.role}</p>
                        <p className="text-sm font-semibold text-gray-900">{referrer.company}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {referrer.location}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">{referrer.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{referrer.referrals} referrals</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedReferrer(referrer);
                        setShowPayment(true);
                      }}
                      className="w-full bg-gradient-primary text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Request Referral
                    </button>
                  </motion.div>
                ))}
              </div>

              {filteredReferrers.length === 0 && (
                <div className="text-center py-20">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No referrers found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {showPayment && selectedReferrer && (
        <ReferralPayment
          jobId="dummy-job-id"
          referrerId={selectedReferrer.id}
          onSuccess={() => {
            setShowPayment(false);
            alert('Payment successful! Referral request sent.');
          }}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default ReferrersPage;
