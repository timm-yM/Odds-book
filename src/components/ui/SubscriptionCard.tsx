
import React from 'react';
import { Crown, Star, Award, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionCardProps {
  plan: 'platinum' | 'gold' | 'silver';
  title: string;
  price: string;
  period: string;
  oddsPerWeek: number;
  daysPerWeek: number;
  features: string[];
  isPopular?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  title,
  price,
  period,
  oddsPerWeek,
  daysPerWeek,
  features,
  isPopular = false
}) => {
  const getIcon = () => {
    switch (plan) {
      case 'platinum':
        return <Crown className="h-8 w-8 text-white" />;
      case 'gold':
        return <Award className="h-8 w-8 text-yellow-400" />;
      case 'silver':
        return <Star className="h-8 w-8 text-gray-300" />;
    }
  };

  const getCardClasses = () => {
    const baseClasses = "relative premium-card p-8 h-full bg-white/5 backdrop-blur-lg";
    if (isPopular) {
      return `${baseClasses} ring-2 ring-cyan-400 scale-105`;
    }
    return baseClasses;
  };

  const getButtonClasses = () => {
    if (plan === 'platinum') {
      return 'w-full bg-gradient-primary hover:bg-gradient-hover text-white font-semibold py-3';
    } else if (plan === 'gold') {
      return 'w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-3';
    } else {
      return 'w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3';
    }
  };

  return (
    <div className={getCardClasses()}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-300 ml-1">/{period}</span>
        </div>
      </div>

      <div className="text-center mb-6 p-4 glass-effect rounded-lg border border-cyan-400/20">
        <div className="text-3xl font-bold text-cyan-400 mb-1">{oddsPerWeek}</div>
        <div className="text-sm text-white">Premium Odds Weekly</div>
        <div className="text-xs text-gray-300 mt-1">
          2 odds × {daysPerWeek} days/week
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <span className="text-gray-200 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        className={getButtonClasses()}
        size="lg"
      >
        Choose {title}
      </Button>
    </div>
  );
};

export default SubscriptionCard;
