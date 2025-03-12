import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface MobileMoneyPaymentProps {
  onSelect: (provider: string) => void;
  selectedProvider: string;
}

export default function MobileMoneyPayment({ onSelect, selectedProvider }: MobileMoneyPaymentProps) {
  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', logo: '🟡' },
    { id: 'airteltigo', name: 'AirtelTigo Money', logo: '🔵' },
    { id: 'telecel', name: 'Telecel Cash', logo: '🔴' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 p-4 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Phone className="text-primary" />
          <h3 className="font-semibold text-primary">Registration Fee</h3>
        </div>
        <p className="text-2xl font-bold text-primary">₵100.00</p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <motion.button
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3
              ${selectedProvider === provider.id 
                ? 'border-primary bg-primary/5' 
                : 'border-primary/20 hover:border-primary'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{provider.logo}</span>
            <span className="font-medium">{provider.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}