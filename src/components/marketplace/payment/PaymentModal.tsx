import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard } from 'lucide-react';
import Button from '../../common/Button';
import MobileMoneyPayment from './MobileMoneyPayment';
import CardPayment from './CardPayment';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onPaymentComplete: (paymentDetails: {
    method: string;
    provider?: string;
    phoneNumber?: string;
    cardDetails?: any;
  }) => void;
}

export default function PaymentModal({ amount, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Payment Method</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {!paymentMethod ? (
          <div className="space-y-4">
            <Button
              onClick={() => setPaymentMethod('mobile')}
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXh5B2J5q_faV5CBjwudUHv6iSdx34rhk0eA&s" alt="MTN" className="h-8" />
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4oqK7PzueCyNwbR4IUhM0rM4mW8ajeTtKA&s" alt="AT" className="h-8" />
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqBE5Z2TJCiY6TNe5xgJLiOJLgcxnjyddKw&s" alt="Telecel" className="h-8" />
                </div>
                <span>Mobile Money</span>
              </div>
            </Button>

            <Button
              onClick={() => setPaymentMethod('card')}
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-4">
                <CreditCard className="w-8 h-8" />
                <span>Credit/Debit Card</span>
              </div>
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Total Amount: <span className="font-bold text-primary">₵{amount.toFixed(2)}</span>
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {paymentMethod === 'mobile' ? (
              <MobileMoneyPayment
                amount={amount}
                onBack={() => setPaymentMethod(null)}
                onPaymentComplete={onPaymentComplete}
              />
            ) : (
              <CardPayment
                amount={amount}
                onBack={() => setPaymentMethod(null)}
                onPaymentComplete={onPaymentComplete}
              />
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}