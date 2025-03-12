import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, UserCircle2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';

interface HomeMenuProps {
  isActive: boolean;
  onNavigate: (path: string) => void;
}

export default function HomeMenu({ isActive, onNavigate }: HomeMenuProps) {
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCircle2, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="relative group">
      <button
        onClick={() => onNavigate('/dashboard')}
        className={`
          w-full flex items-center p-3 rounded-lg transition-all duration-200 hover-lift
          ${isActive ? 'bg-primary-light text-white' : 'text-secondary-dark hover:bg-primary-light/20'}
        `}
      >
        <Home className="mr-3" size={20} />
        <span>Home</span>
      </button>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 mt-1 w-full bg-white rounded-lg shadow-lg overflow-hidden z-10"
        >
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center p-3 text-gray-700 hover:bg-primary-light/10 transition-colors"
            >
              <item.icon size={18} className="mr-2" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}