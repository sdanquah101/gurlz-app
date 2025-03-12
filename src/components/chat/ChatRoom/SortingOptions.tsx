import React from 'react';
import { Clock, TrendingUp, MessageCircle } from 'lucide-react';

type SortOption = 'latest' | 'popular' | 'comments';

interface SortingOptionsProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortingOptions({ selectedSort, onSortChange }: SortingOptionsProps) {
  const options = [
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'comments', label: 'Most Comments', icon: MessageCircle }
  ] as const;

  return (
    <div className="flex space-x-2 mb-6">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onSortChange(value)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors
            ${selectedSort === value
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Icon size={16} className="mr-2" />
          {label}
        </button>
      ))}
    </div>
  );
}