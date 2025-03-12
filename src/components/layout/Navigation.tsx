import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
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
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 p-2 rounded-full bg-primary text-white md:hidden hover:bg-primary-dark"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Menu */}
      <nav className={`
        fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary to-primary-dark text-white
        transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
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
              <button 
                onClick={() => handleNavigation('/profile')}
                className="mt-6 w-full flex items-center space-x-4 hover:bg-primary-light/20 p-3 rounded-lg transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-secondary-dark text-primary-dark flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
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

          <div className="p-4 border-t border-primary-light/20">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center p-3 rounded-lg text-secondary-dark hover:bg-primary-light/20 transition-all duration-200"
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
    >
      <Icon size={20} className="mr-3" />
      <span>{label}</span>
    </button>
  );
}
