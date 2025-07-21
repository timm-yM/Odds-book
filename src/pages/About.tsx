
import React from 'react';
import { Crown, Users, TrendingUp, Shield, Award, Target } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: TrendingUp, label: 'Win Rate', value: '85%' },
    { icon: Users, label: 'Active Members', value: '10,000+' },
    { icon: Award, label: 'Years Experience', value: '8+' },
    { icon: Target, label: 'Tips Delivered', value: '50,000+' }
  ];

  const team = [
    {
      name: 'Michael Johnson',
      role: 'Lead Tipster & Founder',
      experience: '8 years in sports analysis',
      specialty: 'Premier League & Champions League'
    },
    {
      name: 'Sarah Williams',
      role: 'Senior Sports Analyst',
      experience: '6 years professional betting',
      specialty: 'NFL & NBA Analysis'
    },
    {
      name: 'David Chen',
      role: 'Data Science Expert',
      experience: '5 years in sports data',
      specialty: 'Statistical Modeling'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Crown className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="gradient-text">ODDSBOOK</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            We're a team of professional sports analysts and betting experts dedicated to providing 
            you with the most accurate and profitable betting tips in the industry.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="premium-card p-12">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-300 text-center mb-8">
              At ODDSBOOK, we believe that successful sports betting is built on three pillars: 
              expert analysis, data-driven insights, and disciplined bankroll management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Expert Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Our team analyzes every aspect of the game to provide you with winning insights
                </p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Data-Driven</h3>
                <p className="text-gray-400 text-sm">
                  We use advanced statistics and modeling to identify profitable opportunities
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Risk Management</h3>
                <p className="text-gray-400 text-sm">
                  We teach responsible betting practices to protect and grow your bankroll
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Meet Our Expert Team</h2>
          <p className="text-xl text-gray-400">Professional analysts with proven track records</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="premium-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-indigo-400 mb-3">{member.role}</p>
              <p className="text-gray-400 text-sm mb-2">{member.experience}</p>
              <p className="text-gray-300 text-sm font-medium">{member.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose ODDSBOOK?</h2>
          
          <div className="space-y-8">
            <div className="premium-card p-8">
              <h3 className="text-xl font-semibold text-white mb-3">Proven Track Record</h3>
              <p className="text-gray-400">
                With over 8 years in the industry and an 85% win rate, our team has consistently 
                delivered profitable tips to thousands of satisfied members.
              </p>
            </div>
            
            <div className="premium-card p-8">
              <h3 className="text-xl font-semibold text-white mb-3">Transparent Results</h3>
              <p className="text-gray-400">
                We maintain complete transparency with our results. Every tip is tracked and 
                recorded, giving you full visibility into our performance.
              </p>
            </div>
            
            <div className="premium-card p-8">
              <h3 className="text-xl font-semibold text-white mb-3">Professional Support</h3>
              <p className="text-gray-400">
                Our dedicated support team is available 24/7 to help you with any questions 
                or concerns about your subscription or betting strategies.
              </p>
            </div>
            
            <div className="premium-card p-8">
              <h3 className="text-xl font-semibold text-white mb-3">Risk Management</h3>
              <p className="text-gray-400">
                We don't just provide tips - we educate our members on proper bankroll management 
                and responsible betting practices for long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
