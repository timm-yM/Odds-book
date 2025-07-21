
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-dark border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold gradient-text">ODDSBOOK</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Premium sports betting tips and analysis from expert tipsters. 
              Join thousands of successful bettors who trust ODDSBOOK for winning insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/oddsbook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/oddsbook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/oddsbook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/odds" className="block text-gray-300 hover:text-white transition-colors">
                Odds
              </Link>
              <Link to="/parlay" className="block text-gray-300 hover:text-white transition-colors">
                Parlay Tips
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 text-center">
          <p className="text-gray-300">
            © 2024 ODDSBOOK. All rights reserved. Premium Sports Betting Tips Platform.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;