import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-4 pb-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
}