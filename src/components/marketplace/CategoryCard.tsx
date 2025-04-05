import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export default function CategoryCard({ name, description, icon: Icon, color, onClick }: CategoryCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className={`p-3 rounded-xl ${color} text-white w-fit mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.button>
  );
}