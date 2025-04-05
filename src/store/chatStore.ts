import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, Comment } from '../types/chat';
import { supabase } from '../lib/supabase';

interface ChatState {
  messages: ChatMessage[];
  searchQuery: string;
  sortBy: 'recent' | 'popular';
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  fetchUserMessages: (userId: string) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, 'id'>) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  likeMessage: (messageId: string, userId: string) => Promise<void>;
  unlikeMessage: (messageId: string, userId: string) => Promise<void>;
  addComment: (messageId: string, comment: Omit<Comment, 'id' | 'likes' | 'liked'>) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'recent' | 'popular') => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      searchQuery: '',
      sortBy: 'recent',
      isLoading: false,
      error: null,

      fetchMessages: async () => {
        set({ isLoading: true });
        try {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .is('parent_id', null)
            .order('created_at', { ascending: false });

          if (messagesError) throw messagesError;

          const { data: allComments, error: commentsError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .not('parent_id', 'is', null);

          if (commentsError) throw commentsError;

          const commentsByParent = allComments.reduce((acc, comment) => {
            if (!acc[comment.parent_id]) {
              acc[comment.parent_id] = [];
            }
            acc[comment.parent_id].push({
              id: comment.id,
              content: comment.content,
              author: {
                id: comment.profiles.id,
                username: comment.profiles.username,
                avatar: comment.profiles.avatar_url
              },
              isAnonymous: comment.is_anonymous,
              timestamp: comment.created_at,
              likes: comment.likes_count || 0,
              liked: false,
              likedBy: comment.liked_by || []
            });
            return acc;
          }, {});

          const formattedMessages = messagesData.map(message => ({
            id: message.id,
            content: message.content,
            author: {
              id: message.profiles.id,
              username: message.profiles.username,
              avatar: message.profiles.avatar_url
            },
            isAnonymous: message.is_anonymous,
            isSuitableForMinors: message.is_suitable_for_minors,
            timestamp: message.created_at,
            likes: message.likes_count || 0,
            liked: false,
            likedBy: message.liked_by || [],
            comments: commentsByParent[message.id] || [],
            viewCount: message.view_count || 0,
            color: message.color || 'bg-primary'  // Using database color with fallback
          }));

          set({ messages: formattedMessages, error: null });
        } catch (error) {
          console.error('Error fetching messages:', error);
          set({ error: 'Failed to load messages' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserMessages: async (userId: string) => {
        set({ isLoading: true });
        try {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .eq('user_id', userId)
            .is('parent_id', null)
            .order('created_at', { ascending: false });

          if (messagesError) throw messagesError;

          const { data: allComments, error: commentsError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .in('parent_id', messagesData.map(m => m.id));

          if (commentsError) throw commentsError;

          const commentsByParent = allComments.reduce((acc, comment) => {
            if (!acc[comment.parent_id]) {
              acc[comment.parent_id] = [];
            }
            acc[comment.parent_id].push({
              id: comment.id,
              content: comment.content,
              author: {
                id: comment.profiles.id,
                username: comment.profiles.username,
                avatar: comment.profiles.avatar_url
              },
              isAnonymous: comment.is_anonymous,
              timestamp: comment.created_at,
              likes: comment.likes_count || 0,
              liked: false,
              likedBy: comment.liked_by || []
            });
            return acc;
          }, {});

          const formattedMessages = messagesData.map(message => ({
            id: message.id,
            content: message.content,
            author: {
              id: message.profiles.id,
              username: message.profiles.username,
              avatar: message.profiles.avatar_url
            },
            isAnonymous: message.is_anonymous,
            isSuitableForMinors: message.is_suitable_for_minors,
            timestamp: message.created_at,
            likes: message.likes_count || 0,
            liked: false,
            likedBy: message.liked_by || [],
            comments: commentsByParent[message.id] || [],
            viewCount: message.view_count || 0,
            color: message.color || 'bg-primary'  // Using database color with fallback
          }));

          set({ messages: formattedMessages, error: null });
        } catch (error) {
          console.error('Error fetching user messages:', error);
          set({ error: 'Failed to load user messages' });
        } finally {
          set({ isLoading: false });
        }
      },

      addMessage: async (message) => {
        try {
          const { data, error: insertError } = await supabase
            .from('chat_messages')
            .insert({
              content: message.content,
              user_id: message.author.id,
              is_anonymous: message.isAnonymous,
              is_suitable_for_minors: message.isSuitableForMinors,
              liked_by: [],
              parent_id: null,
              view_count: 0
              // Note: color is auto-generated by Supabase function
            })
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .single();

          if (insertError) throw insertError;

          const newMessage = {
            id: data.id,
            content: data.content,
            author: {
              id: data.profiles.id,
              username: data.profiles.username,
              avatar: data.profiles.avatar_url
            },
            isAnonymous: data.is_anonymous,
            isSuitableForMinors: data.is_suitable_for_minors,
            timestamp: data.created_at,
            likes: 0,
            liked: false,
            likedBy: [],
            comments: [],
            viewCount: 0,
            color: data.color || 'bg-primary'  // Using database-generated color
          };

          set(state => ({
            messages: [newMessage, ...state.messages]
          }));
        } catch (error) {
          console.error('Error adding message:', error);
          throw error;
        }
      },

      deleteMessage: async (messageId) => {
        try {
          const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', messageId);

          if (error) throw error;

          set(state => ({
            messages: state.messages.filter(msg => msg.id !== messageId)
          }));
        } catch (error) {
          console.error('Error deleting message:', error);
          throw error;
        }
      },

      likeMessage: async (messageId, userId) => {
        try {
          const { data, error } = await supabase
            .rpc('toggle_message_like', {
              message_id: messageId,
              user_id: userId
            });

          if (error) throw error;

          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId
                ? {
                    ...msg,
                    likes: data.likes_count,
                    likedBy: data.liked_by,
                    liked: data.liked_by.includes(userId)
                  }
                : msg
            )
          }));
        } catch (error) {
          console.error('Error toggling like:', error);
          throw error;
        }
      },

      unlikeMessage: async (messageId, userId) => {
        return get().likeMessage(messageId, userId);
      },

      addComment: async (messageId, comment) => {
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .insert({
              content: comment.content,
              user_id: comment.author.id,
              parent_id: messageId,
              is_anonymous: comment.isAnonymous,
              is_suitable_for_minors: true,
              liked_by: []
            })
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar_url
              )
            `)
            .single();

          if (error) throw error;

          const newComment = {
            id: data.id,
            content: data.content,
            author: {
              id: data.profiles.id,
              username: data.profiles.username,
              avatar: data.profiles.avatar_url
            },
            isAnonymous: data.is_anonymous,
            timestamp: data.created_at,
            likes: 0,
            liked: false,
            likedBy: []
          };

          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId
                ? {
                    ...msg,
                    comments: [...msg.comments, newComment]
                  }
                : msg
            )
          }));
        } catch (error) {
          console.error('Error adding comment:', error);
          throw error;
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      clearMessages: () => set({ messages: [] })
    }),
    {
      name: 'chat-storage'
    }
  )
);