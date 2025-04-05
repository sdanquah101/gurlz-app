import React from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full flex items-center p-3 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-primary-light text-white'
          : 'text-secondary-dark hover:bg-primary-light/20'
        }
      `}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}