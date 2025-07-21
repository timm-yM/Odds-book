
import React from 'react';
import { Target, Plus, TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Parlay = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <Target className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Parlay Tips</span> & Builder
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Maximize your winnings with expertly crafted parlay combinations and our advanced parlay builder tool.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="premium-card p-12 text-center">
            <div className="mb-8">
              <Calculator className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-xl text-gray-400 mb-8">
                Our advanced parlay builder and expert parlay tips are currently in development. 
                This powerful tool will help you create winning combinations with optimal risk management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-3">What's Coming:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-indigo-400 mr-2" />
                    Expert Parlay Combinations
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-indigo-400 mr-2" />
                    Risk Assessment Tools
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-indigo-400 mr-2" />
                    Payout Calculators
                  </li>
                  <li className="flex items-center">
                    <Plus className="h-4 w-4 text-indigo-400 mr-2" />
                    Historical Performance
                  </li>
                </ul>
              </div>

              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Features:</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-indigo-400 mr-2" />
                    Custom Parlay Builder
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-indigo-400 mr-2" />
                    Smart Recommendations
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-indigo-400 mr-2" />
                    Live Odds Integration
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-indigo-400 mr-2" />
                    Bankroll Management
                  </li>
                </ul>
              </div>
            </div>

            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Get Notified When Available
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Parlay;
