
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold gradient-text">ODDSBOOK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-white hover:text-cyan-400 transition-colors">
              Pricing
            </Link>
            <Link to="/odds" className="text-white hover:text-cyan-400 transition-colors">
              Odds
            </Link>
            <Link to="/parlay" className="text-white hover:text-cyan-400 transition-colors">
              Parlay Tips
            </Link>
            <Link to="/about" className="text-white hover:text-cyan-400 transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-cyan-400/10">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:bg-gradient-hover text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-cyan-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-white hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-white hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <Link to="/odds" className="text-white hover:text-cyan-400 transition-colors">
                Odds
              </Link>
              <Link to="/parlay" className="text-white hover:text-cyan-400 transition-colors">
                Parlay Tips
              </Link>
              <Link to="/about" className="text-white hover:text-cyan-400 transition-colors">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-cyan-400/10 justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:bg-gradient-hover text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;