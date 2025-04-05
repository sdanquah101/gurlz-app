export interface FashionPost {
  id: string;
  images: string[];
  description: string;
  tags?: string[];
  likes: number;
  liked?: boolean;
  comments: Comment[];
  timestamp: Date;
  author: {
    id: string;
    username: string;
  };
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
}

export interface SavedInspiration extends FashionPost {
  savedAt: Date;
}