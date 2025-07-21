
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">ODDSBOOK</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/odds" 
                  className="text-white hover:text-blue-400 transition-colors font-medium"
                >
                  Odds
                </Link>
                <Link 
                  to="/parlay" 
                  className="text-white hover:text-blue-400 transition-colors font-medium"
                >
                  Parlay
                </Link>
              </>
            )}
            <Link 
              to="/pricing" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {user.email}
                    {isAdmin && <span className="ml-1 text-yellow-400">(Admin)</span>}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
