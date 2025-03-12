export interface User {
  id: string;
  username: string;
  email: string;
  gender: 'female' | 'male';
  dateJoined: Date;
  country: string;
  phoneNumber: string;
  faceVerified: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  topic: string;
  anonymous: boolean;
  anonymousId: string;
  likes: number;
  hasLiked: boolean;
  replies: ChatReply[];
}

export interface ChatReply {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
  anonymous: boolean;
  anonymousId: string;
}

export interface ChatTopic {
  id: string;
  name: string;
  description: string;
  category: 'physical' | 'mental' | 'sexual' | 'financial' | 'academic' | 'career' | 'elegant';
  icon: string;
}