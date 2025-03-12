export type UserType = 'individual' | 'vendor' | 'organization';
export type UserStatus = 'online' | 'offline';
export type ActivityType = 'post' | 'like' | 'chat' | 'purchase' | 'save';

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  content: string;
  timestamp: Date;
  private: boolean;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  username: string;
  type: UserType;
  bio?: string;
  joinDate: Date;
  location?: string;
  interests: string[];
  profileImage?: string;
  status: UserStatus;
  stats: {
    posts: number;
    chats: number;
    likes: number;
  };
}

