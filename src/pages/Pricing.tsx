
import React from 'react';
import { Crown, Check, X } from 'lucide-react';
import SubscriptionCard from '@/components/ui/SubscriptionCard';

const Pricing = () => {
  const subscriptionPlans = [
    {
      plan: 'silver' as const,
      title: 'Silver',
      price: '$29',
      period: 'month',
      oddsPerWeek: 4,
      daysPerWeek: 2,
      features: [
        '4 Premium Odds Weekly',
        '2 Days Coverage (Weekends)',
        'Expert Analysis & Insights',
        'Email Support',
        'Basic Win/Loss Statistics',
        'Mobile App Access'
      ]
    },
    {
      plan: 'gold' as const,
      title: 'Gold',
      price: '$49',
      period: 'month',
      oddsPerWeek: 6,
      daysPerWeek: 3,
      features: [
        '6 Premium Odds Weekly',
        '3 Days Coverage',
        'Advanced Analysis & Research',
        'Priority Support',
        'Detailed Performance Stats',
        'Parlay Suggestions',
        'Historical Data Access',
        'Community Forum Access'
      ],
      isPopular: true
    },
    {
      plan: 'platinum' as const,
      title: 'Platinum',
      price: '$79',
      period: 'month',
      oddsPerWeek: 10,
      daysPerWeek: 5,
      features: [
        '10 Premium Odds Weekly',
        '5 Days Coverage (Mon-Fri)',
        'VIP Analysis & Research',
        '24/7 Premium Support',
        'Advanced Analytics Dashboard',
        'Custom Parlay Builder',
        'Early Access to Tips',
        'Live Chat with Tipsters',
        'Exclusive VIP Events',
        'Risk Management Tools'
      ]
    }
  ];

  const comparisonFeatures = [
    { feature: 'Premium Odds Weekly', silver: '4', gold: '6', platinum: '10' },
    { feature: 'Days Coverage', silver: '2', gold: '3', platinum: '5' },
    { feature: 'Expert Analysis', silver: true, gold: true, platinum: true },
    { feature: 'Email Support', silver: true, gold: true, platinum: true },
    { feature: 'Mobile App Access', silver: true, gold: true, platinum: true },
    { feature: 'Priority Support', silver: false, gold: true, platinum: true },
    { feature: 'Parlay Suggestions', silver: false, gold: true, platinum: true },
    { feature: 'Community Forum', silver: false, gold: true, platinum: true },
    { feature: 'Advanced Analytics', silver: false, gold: false, platinum: true },
    { feature: 'Custom Parlay Builder', silver: false, gold: false, platinum: true },
    { feature: 'Live Chat with Tipsters', silver: false, gold: false, platinum: true },
    { feature: '24/7 Premium Support', silver: false, gold: false, platinum: true }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <Crown className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your <span className="gradient-text">Premium Plan</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Select the perfect subscription tier that matches your betting strategy and goals. 
            All plans include expert analysis and proven winning strategies.
          </p>
        </div>
      </section>

      {/* Subscription Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <SubscriptionCard key={index} {...plan} />
          ))}
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Detailed Plan Comparison</h2>
          <p className="text-gray-400">Compare all features across our subscription plans</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-gray-400 font-semibold">Silver</th>
                    <th className="text-center p-6 text-yellow-400 font-semibold">Gold</th>
                    <th className="text-center p-6 text-gray-300 font-semibold">Platinum</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="p-6 text-gray-300">{row.feature}</td>
                      <td className="p-6 text-center">
                        {typeof row.silver === 'boolean' ? (
                          row.silver ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-400">{row.silver}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.gold === 'boolean' ? (
                          row.gold ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-yellow-400">{row.gold}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.platinum === 'boolean' ? (
                          row.platinum ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{row.platinum}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-400">Yes, you can change your subscription plan at any time. Changes take effect at the next billing cycle.</p>
          </div>
          
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400">We accept all major credit cards, PayPal, and mobile payment options including M-Pesa for our African users.</p>
          </div>
          
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Is there a money-back guarantee?</h3>
            <p className="text-gray-400">Yes, we offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, get a full refund.</p>
          </div>
          
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">How do I access the tips?</h3>
            <p className="text-gray-400">Tips are delivered through our secure web platform and mobile app. You'll receive notifications when new tips are available.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
