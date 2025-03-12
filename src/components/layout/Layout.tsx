import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuthStore } from '../../store/authStore';
import { Heart } from 'lucide-react';
import CartButton from '../marketplace/cart/CartButton';
import CartDrawer from '../marketplace/cart/CartDrawer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname);

  // Modified auth check to prevent redirect loops
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isAuthPage) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [location.pathname]); // Only check on path change

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/marketplace/checkout');
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-dark">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light">
      <div className="flex">
        <Navigation />
        <main className="flex-1 md:ml-64">
          {/* Top Bar - Higher z-index than navigation */}
          <div className="bg-white shadow-sm p-4 flex items-center justify-between relative z-40">
            <div className="flex items-center space-x-2">
              <Heart className="text-primary w-6 h-6" />
              <h1 className="text-xl font-bold text-primary">Gurlz</h1>
            </div>
            <CartButton onClick={() => setShowCart(true)} />
          </div>
          
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Cart Drawer - Highest z-index */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}