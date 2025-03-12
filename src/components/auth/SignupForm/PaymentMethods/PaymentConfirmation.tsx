import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../common/Button';

interface PaymentConfirmationProps {
  provider: string;
  phoneNumber: string;
  onConfirm: (code: string) => void;
}

export default function PaymentConfirmation({ provider, phoneNumber, onConfirm }: PaymentConfirmationProps) {
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    if (code.trim()) {
      onConfirm(code);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-primary mb-2">
          Payment Confirmation
        </h3>
        <p className="text-sm text-gray-600">
          A payment prompt has been sent to your mobile number {phoneNumber}.
          Please confirm the payment on your phone and enter the confirmation code below.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmation Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter code"
          />
        </div>

        <Button 
          onClick={handleConfirm}
          disabled={!code.trim()} 
          className="w-full"
        >
          Verify Payment
        </Button>
      </div>
    </motion.div>
  );
}