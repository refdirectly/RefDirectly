import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    icon: Briefcase,
    number: '54,571',
    label: 'Open Roles',
    description: "We've helped countless job seekers land their dream jobs — now it's your turn. Browse thousands of open roles on RefDirectly.",
  },
  {
    icon: Users,
    number: '800+',
    label: 'Assigned Referrals',
    description: 'Our network is thousands strong and growing. Get referred by employees from 5000+ companies.',
  },
  {
    icon: Zap,
    number: '377',
    label: 'AI Apply Requests',
    description: 'Our AI Apply feature auto-fills job applications, saving you time and effort. Apply to multiple jobs in seconds with our AI automation.',
  },
];

const Stats: React.FC = () => {
  return (
    <section className="pt-8 pb-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-full">
              Trusted by Thousands
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The world's <span className="bg-gradient-primary bg-clip-text text-transparent">#1</span> referral platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Empowering job seekers with AI-driven connections and verified referrals</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const isOpenRoles = stat.label === 'Open Roles';
            const isAssignedReferrals = stat.label === 'Assigned Referrals';
            const isAIApply = stat.label === 'AI Apply Requests';
            const isClickable = isOpenRoles || isAssignedReferrals || isAIApply;
            const CardWrapper = isClickable ? Link : 'div';
            const cardProps = isOpenRoles ? { to: '/jobs' } : isAssignedReferrals ? { to: '/referrers' } : isAIApply ? { to: '/ai-apply' } : {};
            
            return (
            <CardWrapper
              {...cardProps}
              key={index}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-primary mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-display text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 text-center">{stat.number}</h3>
                <p className="font-bold text-xl text-gray-900 mb-4 text-center">{stat.label}</p>
                <p className="text-gray-600 text-center leading-relaxed">{stat.description}</p>
              </div>
              </motion.div>
            </CardWrapper>
          );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
