import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import CartItem from './CartItem';
import Button from '../../common/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ShoppingCart className="w-6 h-6 text-primary mr-2" />
                    <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  </div>
                  <button onClick={onClose}>
                    <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      ₵{total.toFixed(2)}
                    </span>
                  </div>
                  <Button onClick={onCheckout} className="w-full">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}