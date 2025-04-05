import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import MobileMenuButton from './MobileMenuButton';
import NavHeader from './NavHeader';
import NavLinks from './NavLinks';
import SignOutButton from './SignOutButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <MobileMenuButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={handleClose}
        />
      )}

      <nav className={`
        fixed inset-y-0 left-0 w-full md:w-64 bg-gradient-to-b from-primary to-primary-dark text-white
        transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <NavHeader user={user} />
          <NavLinks onNavigate={handleClose} />
          <SignOutButton />
        </div>
      </nav>
    </>
  );
}