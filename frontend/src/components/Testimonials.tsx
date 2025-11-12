import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  avatar: string;
  quote: string;
  metric: string;
}

const generateMockTestimonials = (count: number): Testimonial[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    company: faker.company.name(),
    avatar: faker.image.avatar(),
    quote: `"${faker.lorem.paragraph({ min: 2, max: 4 })}"`,
    metric: `Got referred to ${faker.company.name()}`,
  }));
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setTestimonials(generateMockTestimonials(6));
  }, []);

  return (
    <section id="testimonials" className="pt-12 pb-20 md:pt-16 md:pb-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Job Seekers and Referrers</h2>
          <p className="text-lg text-gray-600">Hear what our users have to say about their success with ReferUs.</p>
        </div>
        <div className="mt-16">
          <div className="flex overflow-x-auto space-x-8 pb-8 -mx-4 px-4 scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-[320px] bg-white p-8 rounded-xl shadow-subtle border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                <div className="flex items-center justify-between text-sm text-brand-blue font-semibold pt-4 border-t border-gray-100">
                  <span>{testimonial.metric}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
