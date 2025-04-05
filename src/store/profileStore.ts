import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { UserProfile, UserActivity, ChatHistoryItem } from '../types/profile';

interface ProfileState {
  profiles: Record<string, UserProfile>;
  activities: UserActivity[];
  chatHistory: ChatHistoryItem[];
  searchHistory: string[];
  posts: any[]; // Should ideally have a proper type
  
  // Loading and error states
  isLoadingPosts: boolean;
  isLoadingChatHistory: boolean;
  postsError: string | null;
  chatHistoryError: string | null;

  addProfile: (profile: UserProfile) => void;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  addChatHistoryItem: (chat: Omit<ChatHistoryItem, 'id' | 'timestamp'>) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  clearErrors: () => void;
  fetchChatHistory: (userId: string) => Promise<boolean>;
  fetchPosts: (userId: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: {},
      activities: [],
      chatHistory: [],
      searchHistory: [],
      posts: [], 
      
      // Initialize loading and error states
      isLoadingPosts: false,
      isLoadingChatHistory: false,
      postsError: null,
      chatHistoryError: null,

      addProfile: (profile) =>
        set((state) => ({
          profiles: { ...state.profiles, [profile.id]: profile },
        })),

      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [id]: { ...state.profiles[id], ...updates },
          },
        })),

      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.activities,
          ],
        })),

      addChatHistoryItem: (chat) =>
        set((state) => ({
          chatHistory: [
            {
              ...chat,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.chatHistory,
          ],
        })),

      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query).slice(0, 9),
          ],
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),
      
      clearErrors: () => set({ 
        postsError: null, 
        chatHistoryError: null 
      }),

      // Improved function for posts
      fetchPosts: async (userId) => {
        if (!userId) {
          set({ postsError: 'No user ID provided' });
          return false;
        }

        // Set loading state
        set({ isLoadingPosts: true, postsError: null });

        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetching posts for user:', userId);
          }
          
          // Fetch posts - adjust table name as needed for your database
          const { data, error } = await supabase
            .from('girlture_posts') // Ensure this matches your actual table name
            .select('*')
            .eq('author_id', userId) // Ensure this field name matches your schema
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching posts:', error);
            set({ 
              postsError: `Failed to fetch posts: ${error.message}`,
              isLoadingPosts: false
            });
            return false;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('Fetched posts:', data);
          }
          
          // Update the store with posts
          set({ 
            posts: data || [], 
            isLoadingPosts: false 
          });
          
          return true;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Unexpected error fetching posts:', err);
          set({ 
            postsError: `Unexpected error: ${errorMessage}`,
            isLoadingPosts: false
          });
          return false;
        }
      },

      fetchChatHistory: async (userId) => {
        if (!userId) {
          set({ chatHistoryError: 'No user ID provided' });
          return false;
        }

        // Set loading state
        set({ isLoadingChatHistory: true, chatHistoryError: null });

        try {
          console.log('Fetching chat history for user:', userId);
          
          // First, check if the chat_messages table exists
          const { count, error: tableCheckError } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true });
            
          if (tableCheckError) {
            console.error('Error checking chat_messages table:', tableCheckError);
            set({ 
              chatHistoryError: `Table check failed: ${tableCheckError.message}. Ensure 'chat_messages' table exists.`,
              isLoadingChatHistory: false
            });
            return false;
          }
          
          console.log('chat_messages table check passed, found', count, 'total records');
          
          // Fetch messages - ADJUSTED FOR YOUR ACTUAL SCHEMA
          const { data: allMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              id,
              content,
              user_id,
              parent_id,
              created_at,
              likes_count,
              liked_by
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (messagesError) {
            console.error('Error fetching chat messages:', messagesError);
            set({ 
              chatHistoryError: `Failed to fetch chat messages: ${messagesError.message}`,
              isLoadingChatHistory: false
            });
            return false;
          }

          // Log the raw data received
          console.log('Raw chat messages data:', allMessages);

          // Check if we got any messages
          if (!allMessages || allMessages.length === 0) {
            console.log('No chat messages found for user:', userId);
            set({ 
              chatHistory: [], 
              isLoadingChatHistory: false 
            });
            return true;
          }

          // Separate main messages and replies
          const mainMessages = allMessages.filter(msg => !msg.parent_id);
          const replies = allMessages.filter(msg => msg.parent_id);
          
          console.log('Found main messages:', mainMessages.length);
          console.log('Found replies:', replies.length);

          // Transform the data to match what the UI expects
          const chatHistory = mainMessages.map(message => {
            const messageReplies = replies.filter(reply => reply.parent_id === message.id);
            
            return {
              id: message.id,
              content: message.content || "No content",
              userId: message.user_id,
              timestamp: message.created_at,
              // Use likes_count directly from the message
              likes: message.likes_count || 0,
              // Include liked_by information if needed by UI
              likedBy: message.liked_by || [],
              comments: messageReplies.map(reply => ({
                id: reply.id,
                content: reply.content || "No content",
                userId: reply.user_id,
                timestamp: reply.created_at,
                // Use likes_count directly from the reply
                likes: reply.likes_count || 0,
                likedBy: reply.liked_by || []
              }))
            };
          });

          console.log('Processed chat history:', chatHistory);
          
          set({ 
            chatHistory, 
            isLoadingChatHistory: false 
          });
          
          return true;

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Unexpected error fetching chat history:', err);
          set({ 
            chatHistoryError: `Unexpected error: ${errorMessage}`,
            isLoadingChatHistory: false
          });
          return false;
        }
      },
    }),
    {
      name: 'profile-storage',
      // Update partialize to include more data for persistence
      partialize: (state) => ({
        profiles: state.profiles,
        searchHistory: state.searchHistory,
        // Optionally persist posts and chatHistory if needed between sessions
        posts: state.posts,
        chatHistory: state.chatHistory,
      }),
    }
  )
);