// lib/local/chat.ts
import { ChatMessage, Comment } from '../../types/chat';

const STORAGE_KEY = 'local_chat_data';

interface ChatData {
  messages: Record<string, ChatMessage[]>;
  comments: Record<string, Comment[]>;
}

const getStorageData = (): ChatData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialData: ChatData = { messages: {}, comments: {} };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const saveStorageData = (data: ChatData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const localChat = {
  // Message Operations
  getMessages: (roomId: string): ChatMessage[] => {
    const data = getStorageData();
    return data.messages[roomId] || [];
  },

  sendMessage: (
    roomId: string, 
    userId: string, 
    content: string, 
    isAnonymous: boolean
  ): ChatMessage => {
    const data = getStorageData();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      author: {
        id: userId,
        username: isAnonymous ? 'Anonymous' : `User_${userId}`,
      },
      isAnonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      color: getRandomColor(),
      viewCount: 0
    };

    if (!data.messages[roomId]) {
      data.messages[roomId] = [];
    }
    data.messages[roomId].push(newMessage);
    saveStorageData(data);
    return newMessage;
  },

  updateMessage: (messageId: string, content: string): ChatMessage => {
    const data = getStorageData();
    let updatedMessage: ChatMessage | null = null;

    Object.keys(data.messages).forEach(roomId => {
      data.messages[roomId] = data.messages[roomId].map(msg => {
        if (msg.id === messageId) {
          updatedMessage = { ...msg, content };
          return updatedMessage;
        }
        return msg;
      });
    });

    if (!updatedMessage) {
      throw new Error('Message not found');
    }

    saveStorageData(data);
    return updatedMessage;
  },

  deleteMessage: (messageId: string): void => {
    const data = getStorageData();
    Object.keys(data.messages).forEach(roomId => {
      data.messages[roomId] = data.messages[roomId].filter(
        msg => msg.id !== messageId
      );
    });
    saveStorageData(data);
  },

  // Comment Operations
  getComments: (storyId: string): Comment[] => {
    const data = getStorageData();
    return data.comments[storyId] || [];
  },

  addComment: (
    storyId: string,
    { content, authorId, isAnonymous }: { content: string; authorId: string; isAnonymous: boolean }
  ): Comment => {
    const data = getStorageData();
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: authorId,
        username: isAnonymous ? 'Anonymous' : `User_${authorId}`,
      },
      isAnonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: []
    };

    if (!data.comments[storyId]) {
      data.comments[storyId] = [];
    }
    data.comments[storyId].push(newComment);
    saveStorageData(data);
    return newComment;
  },

  updateComment: (commentId: string, content: string): Comment => {
    const data = getStorageData();
    let updatedComment: Comment | null = null;

    Object.keys(data.comments).forEach(storyId => {
      data.comments[storyId] = data.comments[storyId].map(comment => {
        if (comment.id === commentId) {
          updatedComment = { ...comment, content };
          return updatedComment;
        }
        return comment;
      });
    });

    if (!updatedComment) {
      throw new Error('Comment not found');
    }

    saveStorageData(data);
    return updatedComment;
  },

  deleteComment: (commentId: string): void => {
    const data = getStorageData();
    Object.keys(data.comments).forEach(storyId => {
      data.comments[storyId] = data.comments[storyId].filter(
        comment => comment.id !== commentId
      );
    });
    saveStorageData(data);
  },

  // Like Operations
  likeStory: async (storyId: string): Promise<boolean> => {
    const data = getStorageData();
    let success = false;

    Object.keys(data.messages).forEach(roomId => {
      data.messages[roomId] = data.messages[roomId].map(msg => {
        if (msg.id === storyId) {
          success = true;
          return { ...msg, likes: msg.likes + 1, liked: true };
        }
        return msg;
      });
    });

    if (success) {
      saveStorageData(data);
    }
    return success;
  },

  unlikeStory: async (storyId: string): Promise<boolean> => {
    const data = getStorageData();
    let success = false;

    Object.keys(data.messages).forEach(roomId => {
      data.messages[roomId] = data.messages[roomId].map(msg => {
        if (msg.id === storyId) {
          success = true;
          return { ...msg, likes: Math.max(0, msg.likes - 1), liked: false };
        }
        return msg;
      });
    });

    if (success) {
      saveStorageData(data);
    }
    return success;
  },

  likeComment: async (storyId: string, commentId: string): Promise<boolean> => {
    const data = getStorageData();
    if (!data.comments[storyId]) return false;

    let success = false;
    data.comments[storyId] = data.comments[storyId].map(comment => {
      if (comment.id === commentId) {
        success = true;
        return { ...comment, likes: comment.likes + 1, liked: true };
      }
      return comment;
    });

    if (success) {
      saveStorageData(data);
    }
    return success;
  },

  unlikeComment: async (storyId: string, commentId: string): Promise<boolean> => {
    const data = getStorageData();
    if (!data.comments[storyId]) return false;

    let success = false;
    data.comments[storyId] = data.comments[storyId].map(comment => {
      if (comment.id === commentId) {
        success = true;
        return { ...comment, likes: Math.max(0, comment.likes - 1), liked: false };
      }
      return comment;
    });

    if (success) {
      saveStorageData(data);
    }
    return success;
  }
};

// Utility function to generate random colors for messages
const getRandomColor = () => {
  const colors = [
    'bg-primary',
    'bg-rose-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-purple-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};