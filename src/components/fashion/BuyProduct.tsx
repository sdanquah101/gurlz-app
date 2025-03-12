import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Phone, X } from 'lucide-react';
import Button from '../common/Button';

interface BuyProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    vendor: {
      name: string;
      id: string;
    };
  };
  onClose: () => void;
  onPurchase: (paymentDetails: {
    provider: string;
    phoneNumber: string;
    amount: number;
  }) => void;
}

export default function BuyProduct({ product, onClose, onPurchase }: BuyProductProps) {
  const [step, setStep] = useState(1);
  const [paymentProvider, setPaymentProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', logo: '🟡' },
    { id: 'airteltigo', name: 'AirtelTigo Money', logo: '🔵' },
    { id: 'telecel', name: 'Telecel Cash', logo: '🔴' },
  ];

  const handleSubmit = () => {
    onPurchase({
      provider: paymentProvider,
      phoneNumber,
      amount: product.price
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Purchase Product</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Product Summary */}
          <div className="bg-primary/5 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Product</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Vendor</span>
              <span className="font-medium">{product.vendor.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price</span>
              <span className="text-xl font-bold text-primary">₵{product.price}</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <h4 className="font-medium">Select Payment Method</h4>
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setPaymentProvider(provider.id);
                    setStep(2);
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3
                    ${paymentProvider === provider.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-primary/20 hover:border-primary'}`}
                >
                  <span className="text-2xl">{provider.logo}</span>
                  <span className="font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Money Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your mobile money number"
                    required
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!phoneNumber.trim()}
                className="w-full"
              >
                <DollarSign className="mr-2" size={20} />
                Pay ₵{product.price}
              </Button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-primary"
              >
                ← Change payment method
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}