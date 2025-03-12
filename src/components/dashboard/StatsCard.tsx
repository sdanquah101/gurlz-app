import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Crown } from 'lucide-react';
import { usePresence } from '../../hooks/usePresence';
import { useTrendingTopics } from '../../hooks/useTrendingTopics';
import { useDailyQuote } from '../../hooks/useDailyQuote';

export default function StatsCard() {
  const { onlineStats } = usePresence();
  const { trendingTopics } = useTrendingTopics();
  const { quote } = useDailyQuote();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-secondary to-secondary-dark p-6 text-primary rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Users Online</p>
            <h3 className="text-2xl font-bold">{onlineStats?.online || 0}</h3>
          </div>
          <Users size={32} className="text-primary-dark" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-secondary to-secondary-dark p-6 text-primary rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Trending Topic</p>
            <h3 className="text-lg font-bold">
              {trendingTopics?.[0]?.topic || 'Wellness'}
            </h3>
          </div>
          <Heart size={32} className="text-primary-dark" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-secondary to-secondary-dark p-6 text-primary rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Quote of the Day</p>
            <h3 className="text-sm font-bold line-clamp-2">
              {quote?.quote || 'Stay positive and healthy'}
            </h3>
          </div>
          <Crown size={32} className="text-primary-dark" />
        </div>
      </motion.div>
    </div>
  );
}