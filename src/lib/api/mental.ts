import api from './client';
import { ApiResponse } from './types';
import { DailyQuote } from '../../types/quotes';
import { MoodEntry } from '../../types/mental';
import { Video, Comment, Like } from './../../types/mental'; // Define these types in your `types/mental.ts`

export const mental = {
  // Existing endpoints
  getMoodHistory: () => 
    api.get<ApiResponse<MoodEntry[]>>('/mental/mood/history'),
  
  recordMood: (data: Omit<MoodEntry, 'id' | 'timestamp'>) =>
    api.post<ApiResponse<MoodEntry>>('/mental/mood', data),
    
  scheduleAppointment: (data: { date: string; time: string; description: string }) =>
    api.post<ApiResponse<void>>('/mental/appointments', data),
    
  getAppointments: () =>
    api.get<ApiResponse<any[]>>('/mental/appointments'),

  getDailyQuote: () =>
    api.get<ApiResponse<DailyQuote>>('/mental/daily-quote'),

  // New endpoints for videos
  getVideos: () =>
    api.get<ApiResponse<Video[]>>('/mental/videos'),

  getVideoDetails: (id: number) =>
    api.get<ApiResponse<{ video: Video; comments: Comment[] }>>(`/mental/videos/${id}`),

  // New endpoints for comments
  postComment: (data: { video_id: number; user_id: number; content: string }) =>
    api.post<ApiResponse<Comment>>('/mental/comments', data),

  // New endpoints for likes
  addLike: (data: { video_id: number; user_id: number }) =>
    api.post<ApiResponse<Like>>('/mental/likes', data),

  getLikes: (video_id: number) =>
    api.get<ApiResponse<{ likes_count: number }>>(`/mental/likes/${video_id}`)
};

export default mental;
