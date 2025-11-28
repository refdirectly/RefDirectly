import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  'Unlimited referral requests',
  'Priority matching with referrers',
  'AI-powered resume optimization',
  'Advanced analytics dashboard',
  'Dedicated support team',
  'Early access to new features',
];

const PremiumCTA: React.FC = () => {
  const navigate = useNavigate();

  const handleGetPremium = () => {
    navigate('/pricing#pricing-plans');
  };

  return (
    <section className="pt-12 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-6"
                >
                  <Crown className="h-10 w-10" />
                </motion.div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  We're making job referrals accessible for everyone
                </h2>
                <p className="text-xl opacity-90 mb-2">Your career is worth investing in.</p>
                <p className="text-2xl font-bold">Get unlimited referrals with Premium.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleGetPremium}
                  className="bg-white text-brand-purple px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl"
                >
                  Get Premium Now
                </button>
                <button
                  onClick={handleGetPremium}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCTA;
