"use client";

import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  avatar: string;
  quote: string;
  metric: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Lee',
    company: 'Innovate Inc.',
    avatar: 'https://i.pravatar.cc/150?u=sarahlee',
    quote: '"RefferAI was a game-changer. I connected with a referrer at my dream company and got an offer within weeks. The escrow system made me feel secure throughout the process."',
    metric: 'Got referred to Google',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Solutions Corp.',
    avatar: 'https://i.pravatar.cc/150?u=michaelchen',
    quote: '"As a referrer, this platform is fantastic. It\'s easy to manage requests and the payment is always prompt after I submit the proof. Highly recommended!"',
    metric: 'Referred 5 candidates',
  },
  {
    id: '3',
    name: 'Jessica Rodriguez',
    company: 'TechFront',
    avatar: 'https://i.pravatar.cc/150?u=jessicarodriguez',
    quote: '"The AI matching is surprisingly accurate. It connected me with a professional who had the exact background to help with my application. The process was seamless."',
    metric: 'Got referred to Microsoft',
  },
  {
    id: '4',
    name: 'David Kim',
    company: 'NextGen',
    avatar: 'https://i.pravatar.cc/150?u=davidkim',
    quote: '"I was skeptical at first, but RefferAI delivered. The quality of referrers is top-notch, and the platform is incredibly user-friendly."',
    metric: 'Got referred to Amazon',
  },
  {
    id: '5',
    name: 'Emily White',
    company: 'Synergy Co.',
    avatar: 'https://i.pravatar.cc/150?u=emilywhite',
    quote: '"Finally, a referral marketplace that values trust and transparency. The secure payment system is a brilliant feature that sets it apart."',
    metric: 'Got referred to Meta',
  },
  {
    id: '6',
    name: 'James Brown',
    company: 'Quantum Leap',
    avatar: 'https://i.pravatar.cc/150?u=jamesbrown',
    quote: '"Monetizing my network has never been easier. I can help deserving candidates while earning a fair compensation for my time and effort."',
    metric: 'Referred 3 candidates',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Job Seekers and Referrers</h2>
          <p className="text-lg text-gray-600">Hear what our users have to say about their success with RefferAI.</p>
        </div>
        <div className="mt-16">
          <div className="flex overflow-x-auto space-x-8 pb-8 -mx-4 px-4 scrollbar-hide">
            {mockTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[320px] bg-white p-8 rounded-xl shadow-subtle border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic text-base">{testimonial.quote}</p>
                <div className="flex items-center justify-between text-sm text-brand-blue font-semibold pt-4 border-t border-gray-100">
                  <span>{testimonial.metric}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
