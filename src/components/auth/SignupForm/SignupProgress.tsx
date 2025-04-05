import React from 'react';
import { motion } from 'framer-motion';
import { UserType } from '../../../types/auth';

interface SignupProgressProps {
  userType: UserType;
  currentStep?: number;
  totalSteps?: number;
}

export default function SignupProgress({ 
  userType,
  currentStep = 1,
  totalSteps = 3
}: SignupProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary capitalize">
          {userType} Registration
        </h2>
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                ${index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}