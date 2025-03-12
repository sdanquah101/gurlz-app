import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { motion } from 'framer-motion';

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-primary transition-colors"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center"
        >
          {itemCount}
        </motion.div>
      )}
    </button>
  );
}