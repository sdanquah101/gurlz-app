import { TrendingTopic } from '../../types/trending';

// Mock trending topics data
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    topic: 'Wellness Tips',
    score: 95,
    analysis_timestamp: new Date().toISOString(),
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    topic: 'Healthy Living',
    score: 85,
    analysis_timestamp: new Date().toISOString(),
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

export const localTrending = {
  getTrendingTopics: () => [...mockTrendingTopics]
};