import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../common/Button';

interface AgeCheckModalProps {
  onConfirm: (isSuitableForMinors: boolean) => void;
  onClose: () => void;
  content: string;
}

export default function AgeCheckModal({ onConfirm, onClose, content }: AgeCheckModalProps) {
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
          <div className="flex items-center space-x-2 text-primary">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-semibold">Age Appropriateness Check</h3>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm italic">"{content}"</p>
          </div>

          <p className="text-gray-700">
            Is this content suitable for users under 18 years old?
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onConfirm(true)}
              className="w-full"
            >
              Yes, suitable for all ages
            </Button>
            
            <Button
              onClick={() => onConfirm(false)}
              variant="outline"
              className="w-full text-red-500 border-red-500 hover:bg-red-50"
            >
              No, contains mature content
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Please ensure your content follows our community guidelines
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}