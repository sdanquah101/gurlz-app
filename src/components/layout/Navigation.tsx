import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { 
  Home, 
=======
import {
  Home,
>>>>>>> master
  MessageCircle,
  Calendar,
  Activity,
  Brain,
  Shirt,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Heart,
  UserCircle2,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
<<<<<<< HEAD
  
  // Remove any scroll-based visibility behavior
  React.useEffect(() => {
    // This ensures the menu button is always visible regardless of scroll position
=======

  React.useEffect(() => {
    // Force the menu button to remain visible (no scroll-based hiding)
>>>>>>> master
    const handleScroll = () => {
      const menuButton = document.getElementById('mobile-menu-button');
      if (menuButton) {
        menuButton.style.opacity = '1';
        menuButton.style.visibility = 'visible';
      }
    };
<<<<<<< HEAD
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    // Ensure visibility on initial load
    handleScroll();
    
    // Clean up
=======

    window.addEventListener('scroll', handleScroll);
    handleScroll();
>>>>>>> master
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
<<<<<<< HEAD
      {/* Mobile Menu Button - Always visible */}
      <button 
        id="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white md:hidden hover:bg-primary-dark shadow-md opacity-100 transition-none"
        style={{ visibility: 'visible' }}
=======
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white md:hidden hover:bg-primary-dark shadow-md"
>>>>>>> master
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

<<<<<<< HEAD
      {/* Overlay - Modified to not cover the navigation menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 right-64 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Menu - Increased z-index */}
=======
      {/* Overlay: remove `right-64` so it covers the entire screen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Navigation Menu */}
>>>>>>> master
      <nav className={`
        fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary to-primary-dark text-white
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
<<<<<<< HEAD
=======
          {/* Top Section */}
>>>>>>> master
          <div className="p-6 border-b border-primary-light/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-secondary-dark" />
                <h1 className="text-2xl font-serif text-secondary-dark">Gurlz</h1>
              </div>

              {/* Notification Icon */}
              <button
                onClick={() => handleNavigation('/notifications')}
                className="relative text-secondary-dark hover:text-primary"
                aria-label="View notifications"
              >
                <Bell className="w-6 h-6" />
              </button>
            </div>

            {user && (
<<<<<<< HEAD
              <button 
=======
              <button
>>>>>>> master
                onClick={() => handleNavigation('/profile')}
                className="mt-6 w-full flex items-center space-x-4 hover:bg-primary-light/20 p-3 rounded-lg transition-colors"
                aria-label="View profile"
              >
                <div className="w-16 h-16 rounded-full bg-secondary-dark text-primary-dark flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
                  {user.profileImage ? (
<<<<<<< HEAD
                    <img 
                      src={user.profileImage} 
=======
                    <img
                      src={user.profileImage}
>>>>>>> master
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">{user.username[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="text-left min-w-0">
                  <p className="font-medium text-sm truncate">{user.username}</p>
                  <p className="text-xs text-secondary-dark/80 truncate">{user.email}</p>
                </div>
              </button>
            )}
          </div>

<<<<<<< HEAD
=======
          {/* Main Navigation */}
>>>>>>> master
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem onClick={() => handleNavigation('/dashboard')} icon={Home} label="Home" isActive={isActive('/dashboard')} />
            <NavItem onClick={() => handleNavigation('/profile')} icon={UserCircle2} label="Profile" isActive={isActive('/profile')} />
            <NavItem onClick={() => handleNavigation('/chat')} icon={MessageCircle} label="Chat" isActive={isActive('/chat')} />
            <NavItem onClick={() => handleNavigation('/health')} icon={Calendar} label="Reproductive" isActive={isActive('/health')} />
            <NavItem onClick={() => handleNavigation('/physical')} icon={Activity} label="Physical" isActive={isActive('/physical')} />
            <NavItem onClick={() => handleNavigation('/mental')} icon={Brain} label="Mental" isActive={isActive('/mental')} />
            <NavItem onClick={() => handleNavigation('/fashion')} icon={Shirt} label="Gurlture!" isActive={isActive('/fashion')} />
            <NavItem onClick={() => handleNavigation('/marketplace')} icon={ShoppingBag} label="Marketplace" isActive={isActive('/marketplace')} />
          </div>

<<<<<<< HEAD
=======
          {/* Footer / Sign Out */}
>>>>>>> master
          <div className="p-4 border-t border-primary-light/20">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-3 rounded-lg text-secondary-dark hover:bg-primary-light/20 transition-all duration-200"
              aria-label="Sign out"
            >
              <LogOut className="mr-3" size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

interface NavItemProps {
  icon: React.FC<{ size?: number }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center p-3 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-primary-light text-white'
          : 'text-secondary-dark hover:bg-primary-light/20'
        }
      `}
      aria-label={`Navigate to ${label}`}
    >
      <Icon size={20} className="mr-3" />
      <span>{label}</span>
    </button>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> master
