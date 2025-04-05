export interface ChatMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  isSuitableForMinors: boolean;
  timestamp: string;
  created_at?: string; // Added for compatibility
  likes: number;
  liked?: boolean;
  likedBy: string[]; // Made required and initialized as empty array
  comments: Comment[];
  viewCount: number; // Made required and initialized as 0
  color: string; // Made required since we always provide a fallback
  isLiked?: boolean; // Added for consistency
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  timestamp: string;
  created_at?: string; // Added for compatibility
  likes: number;
  liked?: boolean;
  likedBy: string[]; // Made required and initialized as empty array
  replies?: Comment[];
  color: string; // Added to match parent messages
  viewCount: number; // Added for consistency
  isLiked?: boolean; // Added for consistency
}