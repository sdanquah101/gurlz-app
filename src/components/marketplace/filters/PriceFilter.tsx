import React from 'react';
import { motion } from 'framer-motion';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export default function PriceFilter({ minPrice, maxPrice, onPriceChange }: PriceFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Min</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Max</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
            min={minPrice}
          />
        </div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full">
        <motion.div
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: `${(minPrice / 1000) * 100}%`,
            right: `${100 - (maxPrice / 1000) * 100}%`
          }}
        />
      </div>
    </div>
  );
}