import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Clock } from 'lucide-react';

const jobs = [
  { company: 'Stripe', role: 'Software Engineer', type: 'Part-time', location: 'Remote', logo: 'https://logo.clearbit.com/stripe.com' },
  { company: 'Five9', role: 'Product Manager', type: 'Part-time', location: 'Washington DC', logo: 'https://logo.clearbit.com/five9.com' },
  { company: 'TikTok', role: 'Social Media Manager', type: 'Full-time', location: 'Remote', logo: 'https://logo.clearbit.com/tiktok.com' },
  { company: 'Google', role: 'Data Analyst', type: 'Full-time', location: 'San Francisco', logo: 'https://logo.clearbit.com/google.com' },
];

const JobShowcase: React.FC = () => {
  return (
    <section className="pt-12 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Turbocharge your job search with <span className="bg-gradient-primary bg-clip-text text-transparent">AI apply</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Boost your career prospects by streamlining your job search — our AI-powered job application assistant helps you apply efficiently to hundreds of opportunities in just a fraction of the time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Applied
              </div>
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={job.logo} alt={job.company} className="h-10 w-10 object-contain" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-xl font-bold text-gray-600">${job.company[0]}</span>`;
                  }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{job.company}</h3>
                  <p className="text-gray-700 font-semibold mb-3">{job.role}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobShowcase;
