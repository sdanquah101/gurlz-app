import api from './client';
import { ChatMessage, ChatRoom } from '../../types/chat';
import { DailyQuote } from '../../types/quotes';

export const chat = {
  getRooms: () => 
    api.get<ChatRoom[]>('/chat/rooms'),
    
  getRoomByCategory: (category: string) =>
    api.get<ChatRoom>(`/chat/rooms/category/${category}`),
    
  createRoom: (data: { name: string; description: string; category: string }) =>
    api.post<ChatRoom>('/chat/rooms', data),
  
  getMessages: (roomId: string) => 
    api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`),
  
  sendMessage: (roomId: string, content: string, isAnonymous: boolean = false) =>
    api.post('/chat/messages', { roomId, content, isAnonymous }),
    
  likeMessage: (messageId: string) =>
    api.post(`/chat/messages/${messageId}/like`),
    
  replyToMessage: (messageId: string, content: string, isAnonymous: boolean = false) =>
    api.post(`/chat/messages/${messageId}/reply`, { content, isAnonymous }),

  getDailyQuote: () =>
    api.get<DailyQuote>('/chat/daily-quote'),

  getTrendingTopics: () =>
    api.get('/chat/trending')
};