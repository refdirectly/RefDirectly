import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, TrendingUp, Users, Star, Crown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#pricing-plans') {
      setTimeout(() => {
        document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 199 : 1990,
      originalPrice: billingCycle === 'annual' ? 2388 : null,
      tokens: 3,
      description: 'Perfect for exploring the platform',
      features: [
        '3 Referral Tokens',
        'Basic job matching',
        'Standard support',
        'Email notifications',
        'Profile creation'
      ],
      cta: 'Get Started',
      popular: false,
      icon: Users,
      savings: billingCycle === 'annual' ? 'Save ₹398' : null
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 999 : 9990,
      originalPrice: billingCycle === 'annual' ? 11988 : null,
      tokens: 15,
      description: 'Ideal for serious job seekers',
      features: [
        '15 Referral Tokens',
        'AI-powered resume optimization',
        'Priority matching algorithm',
        'Advanced analytics dashboard',
        'Real-time notifications',
        'Dedicated support team',
        'Interview preparation resources',
        'Profile visibility boost'
      ],
      cta: 'Subscribe Now',
      popular: true,
      icon: Crown,
      savings: billingCycle === 'annual' ? 'Save ₹1,998' : null
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      tokens: 'Unlimited',
      description: 'For teams and organizations',
      features: [
        'Unlimited Referral Tokens',
        'Bulk referral requests',
        'Custom integrations',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Advanced reporting',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: Star
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === 'Starter') {
      navigate('/checkout', { state: { plan: planName, billingCycle } });
    } else if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@refdirectly.com';
    } else {
      navigate('/checkout', { state: { plan: planName, billingCycle } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Invest in Your Career Growth
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Choose the plan that accelerates your job search journey
              </p>
              
              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-brand-purple font-semibold'
                      : 'text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-full transition-all ${
                    billingCycle === 'annual'
                      ? 'bg-white text-brand-purple font-semibold'
                      : 'text-white'
                  }`}
                >
                  Annual
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing-plans" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                    plan.popular ? 'ring-4 ring-brand-purple scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-brand-purple to-brand-magenta text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      plan.popular ? 'bg-gradient-to-br from-brand-purple to-brand-magenta' : 'bg-gray-100'
                    }`}>
                      <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      {typeof plan.price === 'number' ? (
                        <>
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                            {billingCycle === 'monthly' && plan.price > 0 && (
                              <span className="text-gray-500">/month</span>
                            )}
                            {billingCycle === 'annual' && plan.price > 0 && (
                              <span className="text-gray-500">/year</span>
                            )}
                          </div>
                          {plan.originalPrice && (
                            <div className="mt-2">
                              <span className="text-gray-400 line-through">₹{plan.originalPrice}</span>
                              <span className="ml-2 text-green-600 font-semibold">{plan.savings}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                      <Zap className="h-4 w-4" />
                      <span className="font-semibold">{plan.tokens} Tokens</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-purple to-brand-magenta text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Token System Explanation */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Referral Tokens Work
              </h2>
              <p className="text-lg text-gray-600">
                Simple, transparent, and fair pricing for every referral request
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1 Token = 1 Referral</h3>
                <p className="text-gray-600">
                  Each token allows you to request one professional referral from verified employees
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Expiry</h3>
                <p className="text-gray-600">
                  Your tokens never expire. Use them whenever you're ready to apply
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Refund on Failure</h3>
                <p className="text-gray-600">
                  Token refunded if no referrer accepts within 48 hours. Risk-free guarantee
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    q: 'What happens if I run out of tokens?',
                    a: 'You can purchase additional tokens anytime or upgrade to a higher plan. Unused tokens roll over to your next billing cycle.'
                  },
                  {
                    q: 'Can I get a refund if the referral doesn\'t work out?',
                    a: 'Yes! If no referrer accepts your request within 48 hours, your token is automatically refunded. If a referral is accepted but not submitted, you\'ll receive a full refund.'
                  },
                  {
                    q: 'Do tokens expire?',
                    a: 'No, your tokens never expire. Use them at your own pace throughout your job search journey.'
                  },
                  {
                    q: 'Can I cancel my subscription?',
                    a: 'Yes, you can cancel anytime. Your tokens remain valid even after cancellation, and you won\'t be charged for the next billing cycle.'
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-purple to-brand-magenta text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of professionals who landed their dream jobs with RefDirectly
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-brand-purple px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all"
              >
                Start Your Free Trial
              </button>
              <p className="mt-4 text-sm opacity-75">
                Start with our Starter plan • 3 tokens from ₹199/month
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
