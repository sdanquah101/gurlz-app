import React from 'react';
import { motion } from 'framer-motion';

interface SituationFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SituationForm({ value, onChange }: SituationFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <p className="text-sm text-gray-600">
        Please briefly describe your situation and what you'd like to discuss. 
        This helps your therapist prepare for the session.
      </p>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: I've been feeling anxious lately and would like to discuss coping strategies..."
        className="w-full p-4 h-32 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
      />
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          All information is kept confidential
        </span>
        <span className="text-gray-500">
          {value.length}/500 characters
        </span>
      </div>
    </motion.div>
  );
}