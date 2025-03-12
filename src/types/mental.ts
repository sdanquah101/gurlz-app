import { Database } from './supabase-types';

// Video System Types
export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  instructor: string;
  duration: string;
  likes: number;
  views: number;
  created_at: string;
}

export interface Comment {
  id: number;
  video_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface Like {
  id: number;
  video_id: number;
  user_id: number;
  created_at: string;
}

// Updated MoodEntry with energy and triggers
export interface MoodEntry {
  id?: number;
  mood: string; // e.g., 'happy', 'neutral', 'sad'
  energy: string; // e.g., 'high', 'medium', 'low', 'tired'
  triggers: string[]; // Array of triggers, e.g., ['Work', 'Social Interactions']
  note: string; // Optional user notes
  timestamp: Date; // When the mood entry was recorded
  user_id?: string; // Associated user ID
  created_at?: string; // Auto-generated timestamp by the database
}

export interface MentalState {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  getMoodHistory: () => MoodEntry[];
}

// Shared Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Helper Types
export type InsertMoodEntry = Omit<MoodEntry, 'id' | 'created_at'>;
export type InsertVideo = Omit<Video, 'id' | 'likes' | 'views' | 'created_at'>;
export type InsertComment = Omit<Comment, 'id' | 'created_at'>;
export type InsertLike = Omit<Like, 'id' | 'created_at'>;

// Database helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
