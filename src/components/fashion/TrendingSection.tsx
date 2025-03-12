import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { TrendPost as TrendPostType } from '../../types/fashion';
import TrendPost from './TrendPost';

interface TrendingSectionProps {
  trends: TrendPostType[];
  onLike: (id: string) => void;
  onAddToWishlist: (id: string) => void;
}

export default function TrendingSection({ trends, onLike, onAddToWishlist }: TrendingSectionProps) {
  const trendingTrends = trends
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-primary">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingTrends.map((trend) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TrendPost
              post={trend}
              onLike={onLike}
              onAddToWishlist={onAddToWishlist}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}