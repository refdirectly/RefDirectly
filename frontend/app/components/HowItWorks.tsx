"use client";

import React from 'react';
import { Search, ShieldCheck, CircleDollarSign } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find Verified Employees',
    description: 'Browse and connect with verified professionals in top companies using our AI-powered search.',
  },
  {
    icon: ShieldCheck,
    title: 'Pay Securely via Escrow',
    description: 'Your payment is safely held in our secure escrow system until the referral is completed.',
  },
  {
    icon: CircleDollarSign,
    title: 'Payment Released After Confirmation',
    description: 'Funds are released to your referrer only once they confirm the referral submission.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">A simple, secure, and transparent process in three steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-gray-50/80 p-8 rounded-xl shadow-subtle border border-gray-100"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 mb-6">
                <step.icon className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
