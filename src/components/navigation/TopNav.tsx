import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { MenuIcon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
      <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="font-headline text-xl font-bold text-foreground">
          LoyaltyHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <Link
                to="/"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/') ? 'text-primary font-semibold' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/login') ? 'text-primary font-semibold' : ''
                }`}
              >
                Login
              </Link>
              {/* <Link to="/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Register
                </Button>
              </Link> */}
            </>
          )}

          {user && !user.isAdmin &&  (
            <>
            <Link
                to="/dashboard"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/dashboard') ? 'text-primary font-semibold' : ''
                }`}
              >Home</Link>
              <Link
                to="/profile"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/profile') ? 'text-primary font-semibold' : ''
                }`}
              >
                Profile
              </Link>
              <Link
                to="/rewards"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/rewards') ? 'text-primary font-semibold' : ''
                }`}
              >
                Rewards
              </Link>
              {!user.isAffiliate &&(
              <Link
                to="/register/affiliate"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/register/affiliate') ? 'text-primary font-semibold' : ''
                }`}
              >
                Đăng Kí Affiliate
              </Link>
              )}
              <Link
                to="/checkout"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  isActive('/checkout') ? 'text-primary font-semibold' : ''
                }`}
              >
                Checkout
              </Link>
              {user.isAffiliate && (
                <Link
                  to="/affiliate/dashboard"
                  className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                    isActive('/affiliate/dashboard') ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Affiliate
                </Link>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-background text-foreground border-border hover:bg-muted"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}

          {user && user.isAdmin && (
            <>
            {/* <Link
                to="/dashboard"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  location.pathname.startsWith('/dashboard') ? 'text-primary font-semibold' : ''
                }`}
              > */}
                {/* Admin */}
              {/* </Link> */}
              <Link
                to="/admin"
                className={`text-foreground hover:text-primary transition-smooth cursor-pointer ${
                  location.pathname.startsWith('/admin') ? 'text-primary font-semibold' : ''
                }`}
              >
                Admin
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-background text-foreground border-border hover:bg-muted"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile MenuIcon Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile MenuIcon */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {!user && (
              <>
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {user && !user.isAdmin && (
              <>
                <Link
                  to="/profile"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/rewards"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rewards
                </Link>
                <Link
                  to="/checkout"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Checkout
                </Link>
                {user.isAffiliate && (
                  <Link
                    to="/affiliate/dashboard"
                    className="text-foreground hover:text-primary transition-smooth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Affiliate
                  </Link>
                )}
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full bg-background text-foreground border-border hover:bg-muted"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}

            {user && user.isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full bg-background text-foreground border-border hover:bg-muted"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
