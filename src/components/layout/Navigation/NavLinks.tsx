import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  Brain, 
  Activity, 
  Shirt, 
  UserCircle2 
} from 'lucide-react';
import NavItem from './NavItem';

interface NavLinksProps {
  onNavigate: () => void;
}

export default function NavLinks({ onNavigate }: NavLinksProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate();
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: UserCircle2, label: 'Profile', path: '/profile' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: Calendar, label: 'Reproductive', path: '/health' },
    { icon: Brain, label: 'Mental', path: '/mental' },
    { icon: Activity, label: 'Physical', path: '/physical' },
    { icon: Shirt, label: 'Fashion', path: '/fashion' },
  ];

  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          icon={<item.icon size={20} />}
          label={item.label}
          isActive={isActive(item.path)}
        />
      ))}
    </div>
  );
}