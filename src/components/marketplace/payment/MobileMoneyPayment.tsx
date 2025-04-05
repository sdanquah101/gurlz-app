import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone } from 'lucide-react';
import Button from '../../common/Button';

interface MobileMoneyPaymentProps {
  amount: number;
  onBack: () => void;
  onPaymentComplete: (details: { method: string; provider: string; phoneNumber: string }) => void;
}

const providers = [
  { id: 'mtn', name: 'MTN Mobile Money', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXh5B2J5q_faV5CBjwudUHv6iSdx34rhk0eA&s' },
  { id: 'at', name: 'AT Money', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4oqK7PzueCyNwbR4IUhM0rM4mW8ajeTtKA&s' },
  { id: 'telecel', name: 'Telecel Cash', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYqBE5Z2TJCiY6TNe5xgJLiOJLgcxnjyddKw&s' }
];

export default function MobileMoneyPayment({ amount, onBack, onPaymentComplete }: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'provider' | 'number' | 'confirm'>('provider');

  const handleSubmit = () => {
    onPaymentComplete({
      method: 'mobile',
      provider: selectedProvider,
      phoneNumber
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'provider':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Select Provider</h4>
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProvider(provider.id);
                  setStep('number');
                }}
                className="w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-4
                  hover:border-primary border-gray-200"
              >
                <img src={provider.logo} alt={provider.name} className="h-8" />
                <span className="font-medium">{provider.name}</span>
              </button>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Enter Mobile Money Number</h4>
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
            <Button 
              onClick={() => setStep('confirm')}
              disabled={!phoneNumber.trim()}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₵{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">
                  {providers.find(p => p.id === selectedProvider)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number:</span>
                <span className="font-medium">{phoneNumber}</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                You will receive a prompt on your phone to confirm the payment.
              </p>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Confirm Payment
            </Button>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {renderStep()}
    </motion.div>
  );
}