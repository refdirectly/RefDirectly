import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CircleDollarSign } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover Verified Professionals',
    description: 'Access our network of authenticated employees at Fortune 500 companies. Advanced AI matching connects you with the right referrers instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Escrow Protection',
    description: 'Enterprise-grade payment security with automated escrow. Your funds remain protected until successful referral completion.',
  },
  {
    icon: CircleDollarSign,
    title: 'Automated Fund Release',
    description: 'Smart contract-based payment release upon verified referral submission. Complete transparency with real-time status tracking.',
  },
];

const HowItWorks: React.FC = () => {
  const sectionVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <section id="how-it-works" className="pt-12 pb-20 md:pt-16 md:pb-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 font-medium">Streamlined referral process with enterprise-grade security and transparency.</p>
        </div>
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-brand-purple transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              variants={cardVariants}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-primary mb-6">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
