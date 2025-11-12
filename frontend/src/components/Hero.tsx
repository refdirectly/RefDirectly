import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gradient-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
          >
            <Zap className="h-4 w-4 text-brand-purple" />
            <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">AI-Powered Referral Network</span>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6"
          >
            Find the right referrer.
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Get hired faster.</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Join a trusted AI-powered referral network that connects you to verified professionals and ensures safe, transparent payments with escrow.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-purple" />
              <span className="font-medium">Secure Escrow Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-magenta" />
              <span className="font-medium">Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-teal" />
              <span className="font-medium">AI-Powered Matching</span>
            </div>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/find-referrer" className="btn btn-primary w-full sm:w-auto text-lg px-8 py-4 shadow-xl hover:shadow-2xl">Find a Referrer</Link>
            <Link to="/become-referrer" className="btn btn-secondary w-full sm:w-auto text-lg px-8 py-4">Become a Referrer</Link>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:max-w-[512px] xl:max-w-[650px] md:h-[294px] xl:h-[375px] shadow-2xl">
                <div className="rounded-xl overflow-hidden h-[156px] md:h-[278px] xl:h-[359px] bg-white">
                    <video controls autoPlay loop muted playsInline className="h-[156px] md:h-[278px] xl:h-[359px] w-full object-cover">
                      <source src="/ReferUs_ AI Job Referrals.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
            <div className="relative mx-auto bg-gray-900 rounded-b-xl h-[24px] max-w-[301px] md:max-w-[512px] xl:max-w-[650px] shadow-2xl">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
