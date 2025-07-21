
import React from 'react';
import { Lock, Crown, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Odds = () => {
  // Mock data for demonstration
  const sampleOdds = [
    {
      id: 1,
      match: "Manchester United vs Liverpool",
      league: "Premier League",
      tip: "Over 2.5 Goals",
      odds: "1.85",
      confidence: "High",
      analysis: "Both teams have strong attacking records...",
      date: "2024-01-20",
      time: "15:30"
    },
    {
      id: 2,
      match: "Barcelona vs Real Madrid",
      league: "La Liga",
      tip: "Both Teams to Score",
      odds: "1.65",
      confidence: "Medium",
      analysis: "El Clasico always delivers goals...",
      date: "2024-01-21",
      time: "20:00"
    }
  ];

  const isAuthenticated = false; // This would come from your auth context
  const hasSubscription = false; // This would come from your subscription context

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Premium Content</h1>
          <p className="text-gray-400 mb-8">
            Sign in to access our expert betting tips and analysis
          </p>
          <div className="space-y-4">
            <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90">
              Sign In
            </Button>
            <Button variant="outline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <Crown className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Premium Subscription Required</h1>
          <p className="text-gray-400 mb-8">
            Upgrade to any premium plan to access our expert betting tips and detailed analysis
          </p>
          <div className="space-y-4">
            <Link to="/pricing">
              <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90">
                View Pricing Plans
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <TrendingUp className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Today's <span className="gradient-text">Premium Tips</span>
          </h1>
          <p className="text-xl text-gray-400">
            Expert analysis and winning picks from our professional tipsters
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {sampleOdds.map((tip) => (
            <div key={tip.id} className="premium-card p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{tip.match}</h3>
                  <p className="text-indigo-400 text-sm">{tip.league}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  tip.confidence === 'High' ? 'bg-green-500/20 text-green-400' :
                  tip.confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tip.confidence} Confidence
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {tip.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {tip.time}
                </div>
              </div>

              <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">Recommended Tip:</span>
                  <span className="text-indigo-400 font-bold">@{tip.odds}</span>
                </div>
                <p className="text-lg font-bold text-white">{tip.tip}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Expert Analysis:</h4>
                <p className="text-gray-400 text-sm">{tip.analysis}</p>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Place Bet
                </Button>
                <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Load More Tips
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Odds;
