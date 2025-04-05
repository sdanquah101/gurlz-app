import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function SignOutButton() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 border-t border-primary-light/20">
      <button
        onClick={handleSignOut}
        className="w-full flex items-center p-3 rounded-lg text-secondary-dark hover:bg-primary-light/20 transition-all duration-200"
      >
        <LogOut className="mr-3" size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}