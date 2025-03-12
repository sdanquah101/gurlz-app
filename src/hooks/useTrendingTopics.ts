import { useState, useEffect } from 'react';
import { TrendingTopic } from '../types/trending';
import { localTrending } from '../lib/local/trending';

export function useTrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get topics from local storage
    const topics = localTrending.getTrendingTopics();
    setTrendingTopics(topics);
    setLoading(false);
  }, []);

  return { trendingTopics, loading };
}