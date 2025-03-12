import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Store } from 'lucide-react';
import { UserType } from '../../../types/auth';

interface UserTypeSelectionProps {
  onSelect: (type: UserType) => void;
}

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  const userTypes = [
    {
      type: 'individual' as UserType,
      icon: User,
      title: 'Individual',
      description: 'Join as a personal user'
    },
    {
      type: 'organization' as UserType,
      icon: Building2,
      title: 'Organization',
      description: 'Register as an organization'
    },
    {
      type: 'vendor' as UserType,
      icon: Store,
      title: 'Vendor',
      description: 'Join as a vendor (₵100 registration fee)'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary text-center mb-6">
        Choose Account Type
      </h2>

      <div className="space-y-4">
        {userTypes.map(({ type, icon: Icon, title, description }) => (
          <motion.button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full p-4 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}