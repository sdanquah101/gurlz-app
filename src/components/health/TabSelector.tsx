import React from 'react';
import { motion } from 'framer-motion';

interface TabSelectorProps {
  activeTab: 'calendar' | 'analytics' | 'info';
  onTabChange: (tab: 'calendar' | 'analytics' | 'info') => void;
}

export default function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="bg-white rounded-xl p-2 flex space-x-2">
      {['calendar', 'analytics', 'info'].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab as 'calendar' | 'analytics' | 'info')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
            ${activeTab === tab 
              ? 'bg-primary text-white' 
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}