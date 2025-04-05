import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button 
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-white md:hidden hover:bg-primary-dark transition-colors"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}