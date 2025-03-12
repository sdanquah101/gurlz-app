import React from 'react';
import { Search } from 'lucide-react';

interface TrendSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TrendSearch({ searchQuery, onSearchChange }: TrendSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search trends, descriptions, or tags..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}