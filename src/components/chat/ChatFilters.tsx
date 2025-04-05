import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ChatFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'recent' | 'popular';
  onSortChange: (sort: 'recent' | 'popular') => void;
}

export default function ChatFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: ChatFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSortChange('recent')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            sortBy === 'recent' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          <Filter size={18} />
          <span>Recent</span>
        </button>
        <button
          onClick={() => onSortChange('popular')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            sortBy === 'popular' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          <Filter size={18} />
          <span>Popular</span>
        </button>
      </div>
    </div>
  );
}