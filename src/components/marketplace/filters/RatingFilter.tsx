import React from 'react';
import { Star } from 'lucide-react';

interface RatingFilterProps {
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
}

export default function RatingFilter({ selectedRating, onRatingChange }: RatingFilterProps) {
  return (
    <div className="space-y-2">
      {[4, 3, 2, 1].map((rating) => (
        <button
          key={rating}
          onClick={() => onRatingChange(selectedRating === rating ? null : rating)}
          className={`flex items-center w-full p-2 rounded-lg transition-colors
            ${selectedRating === rating ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
        >
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={index < rating ? 'fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">& up</span>
        </button>
      ))}
    </div>
  );
}