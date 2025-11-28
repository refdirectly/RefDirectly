import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  quote: string;
  metric: string;
}

const indianNames = [
  { name: 'Priya Sharma', role: 'Senior Software Engineer', company: 'Tech Mahindra', quote: 'RefDirectly helped me land my dream job at Google! The referral process was smooth and the referrer was very supportive throughout.', metric: 'Got referred to Google', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { name: 'Rahul Verma', role: 'Product Manager', company: 'Infosys', quote: 'I was struggling to get interviews at top companies. Through RefDirectly, I connected with an Amazon employee who referred me, and I got the job!', metric: 'Got referred to Amazon', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { name: 'Ananya Reddy', role: 'Data Scientist', company: 'Wipro', quote: 'The platform is amazing! I got referred to Microsoft within a week of posting my request. Highly recommend to all job seekers.', metric: 'Got referred to Microsoft', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
  { name: 'Arjun Patel', role: 'Full Stack Developer', company: 'TCS', quote: 'Best investment I made in my career. The referrer not only submitted my resume but also gave me interview tips. Got the offer!', metric: 'Got referred to Meta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
  { name: 'Sneha Iyer', role: 'UX Designer', company: 'HCL Technologies', quote: 'RefDirectly made the impossible possible. I got a referral to Apple and cleared all rounds. Forever grateful!', metric: 'Got referred to Apple', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  { name: 'Vikram Singh', role: 'DevOps Engineer', company: 'Cognizant', quote: 'The real-time matching feature is brilliant. Within hours of my request, I had multiple referrers reaching out. Landed at Netflix!', metric: 'Got referred to Netflix', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  { name: 'Kavya Nair', role: 'Business Analyst', company: 'Accenture', quote: 'I was skeptical at first, but RefDirectly exceeded my expectations. The referrer was professional and the process was transparent.', metric: 'Got referred to Goldman Sachs', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
  { name: 'Aditya Kumar', role: 'Machine Learning Engineer', company: 'Capgemini', quote: 'Got my dream job at Tesla through RefDirectly! The platform connects you with genuine employees who actually care about helping.', metric: 'Got referred to Tesla', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { name: 'Meera Desai', role: 'Frontend Developer', company: 'Mindtree', quote: 'The escrow payment system gave me confidence. Paid only after the referral was confirmed. Professional and trustworthy platform!', metric: 'Got referred to Adobe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
  { name: 'Rohan Gupta', role: 'Cloud Architect', company: 'LTI', quote: 'RefDirectly is a game-changer for job seekers. I got referred to AWS and the entire process was seamless. Thank you!', metric: 'Got referred to AWS', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
  { name: 'Divya Menon', role: 'QA Engineer', company: 'Mphasis', quote: 'I tried multiple platforms but RefDirectly is the only one that actually works. Got referred to Salesforce within 3 days!', metric: 'Got referred to Salesforce', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop' },
  { name: 'Karthik Rao', role: 'Backend Developer', company: 'Tech Mahindra', quote: 'The anonymous chat feature is great for discussing details before committing. Got referred to LinkedIn and received an offer!', metric: 'Got referred to LinkedIn', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop' },
];

const generateMockTestimonials = (count: number): Testimonial[] => {
  return indianNames.slice(0, count).map((person, index) => ({
    id: `testimonial-${index}`,
    name: person.name,
    company: person.company,
    role: person.role,
    avatar: person.avatar,
    quote: person.quote,
    metric: person.metric,
  }));
};

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setTestimonials(generateMockTestimonials(12));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-24">
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Real stories from job seekers and referrers who found success through RefDirectly.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                  className="bg-gray-50 p-8 rounded-xl shadow-subtle border border-gray-100 relative"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-blue/20" />
                  <div className="flex items-center mb-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-brand-blue font-semibold">{testimonial.metric}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12 pb-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of professionals who have found their dream jobs through verified referrals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="btn btn-primary w-full sm:w-auto">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="btn btn-secondary w-full sm:w-auto">
                  Learn How It Works
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
