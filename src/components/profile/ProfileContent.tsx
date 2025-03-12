import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import PostsGrid from './PostsGrid';
import ChatHistory from './ChatHistory';
import ActivityTimeline from './ActivityTimeline';
import { AlertCircle, Lock } from 'lucide-react';

interface ProfileContentProps {
  activeTab: string;
  userId: string;
}

// Define the shape of the data from stores for better type safety
interface Post {
  id: string;
  // Add other post properties as needed
}

interface ChatHistoryItem {
  id: string;
  // Add other chat history properties as needed
}

interface Activity {
  id: string;
  // Add other activity properties as needed
}

export default function ProfileContent({ activeTab, userId }: ProfileContentProps) {
  const { user, fetchUserFromSupabase } = useAuthStore();
  const { 
    posts = [], // Add default empty array
    activities = [], // Add default empty array
    chatHistory = [], 
    fetchChatHistory,
    fetchPosts,
    isLoadingPosts,
    isLoadingChatHistory: isLoadingChats,
    postsError,
    chatHistoryError,
    clearErrors
  } = useProfileStore();

  // Add loading and error states
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = user?.id === userId;

  // Fetch user data if not loaded
  useEffect(() => {
    let isMounted = true;
    
    if (!user && userId) {
      setIsLoadingUser(true);
      setError(null);
      
      const fetchUser = async () => {
        try {
          await fetchUserFromSupabase(userId);
        } catch (err) {
          if (isMounted) {
            setError("Failed to load user data. Please try again.");
            console.error("Error fetching user:", err);
          }
        } finally {
          if (isMounted) {
            setIsLoadingUser(false);
          }
        }
      };
      
      fetchUser();
    }
    
    return () => {
      isMounted = false;
    };
  }, [userId, fetchUserFromSupabase, user]);

  // Fetch chat history when chats tab is active
  useEffect(() => {
    let isMounted = true;
    
    if (activeTab === 'chats' && isOwnProfile && userId) {
      clearErrors(); // Clear any previous errors
      
      const fetchChats = async () => {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetching chat history for own profile:', userId);
          }
          const success = await fetchChatHistory(userId);
          
          if (!success && isMounted && !chatHistoryError) {
            setError("Failed to load chat history. Please try again.");
          }
        } catch (err) {
          if (isMounted) {
            setError("Failed to load chat history. Please try again.");
            console.error("Error fetching chat history:", err);
          }
        }
      };
      
      fetchChats();
    }
    
    return () => {
      isMounted = false;
    };
  }, [activeTab, isOwnProfile, userId, fetchChatHistory, clearErrors, chatHistoryError]);

  // Fetch posts when posts tab is active
  useEffect(() => {
    let isMounted = true;
    
    if (userId && activeTab === 'posts') {
      clearErrors(); // Clear any previous errors
      
      const fetchUserPosts = async () => {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetching posts for user:', userId);
          }
          const success = await fetchPosts(userId);
          
          if (!success && isMounted && !postsError) {
            setError("Failed to load posts. Please try again.");
          }
        } catch (err) {
          if (isMounted) {
            setError("Failed to load posts. Please try again.");
            console.error("Error fetching posts:", err);
          }
        }
      };
      
      fetchUserPosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [activeTab, userId, fetchPosts, clearErrors, postsError]);

  // Debug isOwnProfile calculation
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('isOwnProfile calculation:');
      console.log('- Current user ID:', user?.id);
      console.log('- Profile user ID:', userId);
      console.log('- isOwnProfile result:', isOwnProfile);
    }
  }, [user?.id, userId, isOwnProfile]);

  const renderPrivateContent = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Lock className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Private Content</h3>
      <p className="text-gray-500 text-center max-w-sm">
        This content is private and can only be viewed by the profile owner.
      </p>
    </div>
  );

  const renderError = () => {
    // Determine which error to display (component error, store error, or general error)
    const errorToDisplay = error || postsError || chatHistoryError || "An unknown error occurred";
    
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{errorToDisplay}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => {
            setError(null);
            clearErrors();
            // Trigger refetch based on active tab
            if (activeTab === 'posts') {
              fetchPosts(userId);
            } else if (activeTab === 'chats' && isOwnProfile) {
              fetchChatHistory(userId);
            }
          }}
        >
          Try Again
        </button>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const renderEmptyState = (type: 'posts' | 'chats' | 'activity') => {
    const messages = {
      posts: {
        primary: "No posts yet",
        secondary: ""
      },
      chats: {
        primary: "No chat history available",
        secondary: "Your chat messages and replies will appear here"
      },
      activity: {
        primary: "No recent activity",
        secondary: "Your activities will appear here"
      }
    };

    return (
      <div className="text-center py-8 text-gray-500">
        <p>{messages[type].primary}</p>
        {messages[type].secondary && (
          <p className="text-sm mt-2">{messages[type].secondary}</p>
        )}
      </div>
    );
  };

  const renderContent = useMemo(() => {
    // Show error if any
    if (error || postsError || chatHistoryError) {
      return renderError();
    }

    // Show loading states based on active tab
    if (
      (activeTab === 'posts' && isLoadingPosts) ||
      (activeTab === 'chats' && isLoadingChats) ||
      (activeTab === 'activity' && isLoadingActivities)
    ) {
      return renderLoading();
    }

    switch (activeTab) {
      case 'posts':
        return posts.length === 0 
          ? renderEmptyState('posts')
          : <PostsGrid posts={posts} />;

      case 'chats':
        if (!isOwnProfile) {
          return renderPrivateContent();
        }
        
        return chatHistory.length === 0
          ? renderEmptyState('chats')
          : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Chat History</h3>
              </div>
              <ChatHistory chats={chatHistory} />
            </div>
          );

      
    }
  }, [
    activeTab, 
    posts, 
    activities, 
    chatHistory, 
    isOwnProfile, 
    error,
    isLoadingPosts,
    isLoadingChats,
    isLoadingActivities
  ]);

  if (isLoadingUser || !user) {
    return renderLoading();
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Debug information (only visible during development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg--100 rounded text-xs">
          
        </div>
      )}
      
      {renderContent}
    </div>
  );
}