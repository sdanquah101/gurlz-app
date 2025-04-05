import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export default function FeatureCard({ title, description, icon: Icon, color, onClick }: FeatureCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}