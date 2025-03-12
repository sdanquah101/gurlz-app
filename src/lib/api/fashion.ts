import api from './client';
import { TrendPost } from '../../types/fashion';

export const fashion = {
  getTrends: () => 
    api.get<TrendPost[]>('/fashion/trends'),
    
  createTrend: (data: FormData) =>
    api.post('/fashion/trends', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  likeTrend: (trendId: string) =>
    api.post(`/fashion/trends/${trendId}/like`),
    
  saveTrend: (trendId: string) =>
    api.post(`/fashion/trends/${trendId}/save`),
    
  removeSavedTrend: (trendId: string) =>
    api.delete(`/fashion/trends/${trendId}/save`),
    
  searchTrends: (query: string) =>
    api.get('/fashion/trends/search', { params: { q: query } })
};