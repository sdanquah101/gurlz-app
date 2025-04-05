import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Loader } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useChat } from '../../hooks/useChat';
import ChatFilters from './ChatFilters';
import ChatCard from './ChatCard';
import NewChatButton from './NewChatButton';

const COLORS = [
  'bg-rose-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-indigo-500',
  'bg-green-500'
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export default function ChatList() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    messages,
    loading: isLoading,
    error,
    sendMessage: sendChatMessage,
    deleteMessage: deleteChatMessage,
<<<<<<< HEAD
    toggleLike
=======
    toggleLike,
    reportMessage  // Destructure the new report function
>>>>>>> master
  } = useChat();

  // Local state for filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'recent' | 'popular'>('recent');

  const isUserOver18 = useMemo(() => user?.ageGroup !== '12-18', [user]);

  // Filter and sort messages
  const filteredMessages = useMemo(() => {
    return (messages || [])
      .filter((message) => {
        const matchesSearch =
          message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (!message.isAnonymous &&
            message.author.username.toLowerCase().includes(searchQuery.toLowerCase()));

        const isAgeAppropriate = message.isSuitableForMinors || isUserOver18;

        return matchesSearch && isAgeAppropriate;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.likes - a.likes;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [messages, searchQuery, sortBy, isUserOver18]);

  // Handle adding a new chat
  const handleNewChat = useCallback(async (
    content: string,
    isAnonymous: boolean,
    isSuitableForMinors: boolean
  ) => {
    if (!user) return;
    await sendChatMessage(content, isAnonymous, isSuitableForMinors);
  }, [user, sendChatMessage]);
<<<<<<< HEAD
  
=======
>>>>>>> master

  // Handle liking a message
  const handleLike = useCallback(async (messageId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleLike(messageId);
  }, [user, toggleLike, navigate]);

  // Handle deleting a message
  const handleDelete = useCallback(async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteChatMessage(messageId);
    }
  }, [deleteChatMessage]);

<<<<<<< HEAD
=======
  // Handle reporting a message
  const handleReport = useCallback(async (messageId: string) => {
    const reason = window.prompt('Please provide a reason for reporting this message:');
    if (!reason) return; // Exit if the user cancels or does not provide a reason

    try {
      await reportMessage(messageId, reason);
      alert('Thank you for your report. Our moderators will review it shortly.');
    } catch (error) {
      alert('There was an error reporting the message. Please try again later.');
    }
  }, [reportMessage]);

>>>>>>> master
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold mb-4">Girls' Chatroom</h1>
=======
        <h1 className="text-3xl font-bold mb-4">Gurlz Chatroom</h1>
>>>>>>> master
        <p className="text-secondary-light/90">
          Explore stories, engage with others, and have fun!
        </p>
      </div>

      {/* Filters and New Chat */}
      <div className="sticky top-0 z-10 bg-gray-50 p-4 rounded-xl shadow-sm space-y-6">
        <ChatFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <NewChatButton onNewChat={handleNewChat} />
      </div>

      {/* Chat List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ChatCard
                  {...message}
                  metrics={{
                    likes: message.likes,
                    likedBy: message.likedBy,
                    isLiked: message.isLiked,
                    repliesCount: message.comments?.length || 0,
                    viewCount: message.viewCount
                  }}
                  timestamp={message.created_at}
                  onClick={() => navigate(`/chat/${message.id}`)}
                  onLike={() => handleLike(message.id)}
                  onDelete={
                    message.author.id === user?.id
                      ? () => handleDelete(message.id)
                      : undefined
                  }
<<<<<<< HEAD
=======
                  onReport={() => handleReport(message.id)}  // Added report handler
>>>>>>> master
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12 bg-white rounded-xl"
            >
              <MessageSquarePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> master
