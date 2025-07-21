
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, Crown, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubscriptionCard from '@/components/ui/SubscriptionCard';

const Home = () => {
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
        '2 Days Coverage',
        'Expert Analysis',
        'Email Support',
        'Basic Statistics'
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
        'Advanced Analysis',
        'Priority Support',
        'Detailed Statistics',
        'Parlay Suggestions'
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
        '5 Days Coverage',
        'VIP Analysis',
        '24/7 Premium Support',
        'Advanced Analytics',
        'Custom Parlay Builder',
        'Early Access to Tips'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Premium</span>
              <br />
              <span className="text-white">Sports Betting Tips</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of successful bettors who trust ODDSBOOK for expert analysis, 
              winning picks, and professional sports betting insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-hover text-white text-lg px-8 py-4">
                Start Winning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose ODDSBOOK?</h2>
          <p className="text-xl text-gray-300">Professional insights backed by data and expertise</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="premium-card p-8 text-center">
            <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Expert Analysis</h3>
            <p className="text-gray-300">Professional tipsters with years of experience and proven track records</p>
          </div>
          
          <div className="premium-card p-8 text-center">
            <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Secure Platform</h3>
            <p className="text-gray-300">Bank-level security with encrypted data and protected member content</p>
          </div>
          
          <div className="premium-card p-8 text-center">
            <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Active Community</h3>
            <p className="text-gray-300">Join thousands of winning bettors sharing insights and strategies</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">85%</div>
            <div className="text-gray-300">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-gray-300">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
            <div className="text-gray-300">Tips Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Crown className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300">Select the perfect subscription for your betting strategy</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <SubscriptionCard key={index} {...plan} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-hover text-white">
              View All Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="premium-card p-12 text-center max-w-4xl mx-auto">
          <Target className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Winning?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join ODDSBOOK today and get access to premium betting tips from expert tipsters
          </p>
          <Button size="lg" className="bg-gradient-primary hover:bg-gradient-hover text-white text-lg px-8 py-4">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
