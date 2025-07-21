
import React, { useState, useEffect } from 'react';
import { Lock, Crown, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tip {
  id: string;
  match_name: string;
  odds: number;
  tip: string;
  plan_access: 'silver' | 'gold' | 'platinum';
  analysis: string;
  match_date: string;
  created_at: string;
}

const Odds = () => {
  const { user, isAdmin } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
      fetchTips();
    }
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      setUserSubscription(data?.[0]?.plan || null);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTips(data || []);
    } catch (error: any) {
      console.error('Error fetching tips:', error);
      toast({
        title: "Error",
        description: "Failed to load tips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Premium Content</h1>
          <p className="text-gray-400 mb-8">
            Sign in to access our expert betting tips and analysis
          </p>
          <div className="space-y-4">
            <Link to="/auth">
              <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!userSubscription && !isAdmin) {
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
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading tips...</div>
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
          {userSubscription && (
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-gradient-primary rounded-full text-white font-semibold">
                {userSubscription.toUpperCase()} MEMBER
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Tips Grid */}
      <section className="container mx-auto px-4 pb-20">
        {tips.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No tips available at the moment.</p>
            <p className="mt-2">Check back soon for new expert predictions!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {tips.map((tip) => (
              <div key={tip.id} className="premium-card p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{tip.match_name}</h3>
                    <p className="text-indigo-400 text-sm">
                      {tip.plan_access.toUpperCase()} ACCESS
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    High Confidence
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(tip.match_date || tip.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(tip.match_date || tip.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Recommended Tip:</span>
                    <span className="text-indigo-400 font-bold">@{tip.odds}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{tip.tip}</p>
                </div>

                {tip.analysis && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Expert Analysis:</h4>
                    <p className="text-gray-400 text-sm">{tip.analysis}</p>
                  </div>
                )}

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
        )}
      </section>
    </div>
  );
};

export default Odds;
