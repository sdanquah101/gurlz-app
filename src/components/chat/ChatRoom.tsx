import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Eye, ArrowLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useChat } from '../../hooks/useChat';
import Button from '../common/Button';

// Anonymous naming utility (could be moved to a separate file later)
const anonUserMap = new Map();
let anonCounter = 1;

const getAnonDisplayName = (userId) => {
  if (!anonUserMap.has(userId)) {
    anonUserMap.set(userId, `AnonGurl${anonCounter++}`);
  }
  return anonUserMap.get(userId);
};

export default function ChatRoom() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const {
    messages,
    parentMessage,
    loading,
    error,
    sendMessage,
    toggleLike,
    deleteMessage
  } = useChat(chatId);

  // Reset anonCounter when component mounts
  useEffect(() => {
    anonCounter = 1;
    anonUserMap.clear();
  }, [chatId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    const success = await sendMessage(comment, isAnonymous);
    if (success) {
      setComment('');
      setIsAnonymous(false);
    }
  };

  const handleLike = async (messageId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleLike(messageId);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const success = await deleteMessage(commentId);
      if (success && commentId === chatId) {
        navigate('/chat');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !parentMessage) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'Chat not found'}</p>
        <Button onClick={() => navigate('/chat')} className="mt-4">
          Back to Chats
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Parent Message - Using dynamic color */}
      <div className={`${parentMessage.color} rounded-xl overflow-hidden mb-6 w-full`}>
        <div className="p-6">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/chat')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Chatroom
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {parentMessage.isAnonymous ? (
                  <span className="text-lg font-bold text-white">
                    {getAnonDisplayName(parentMessage.author.id)[0].toUpperCase()}
                  </span>
                ) : parentMessage.author.avatar ? (
                  <img 
                    src={parentMessage.author.avatar} 
                    alt={parentMessage.author.username}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {parentMessage.author.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {parentMessage.isAnonymous 
                    ? getAnonDisplayName(parentMessage.author.id) 
                    : parentMessage.author.username}
                </h2>
                <p className="text-white/70 text-sm">
                  {parentMessage.created_at ? new Date(parentMessage.created_at).toLocaleString() : ''}
                </p>
              </div>
            </div>

            {user?.id === parentMessage.author.id && (
              <button
                onClick={() => handleDeleteComment(parentMessage.id)}
                className="text-white/70 hover:text-white transition-colors"
                title="Delete message"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <p className="text-white mb-4 whitespace-pre-wrap">{parentMessage.content}</p>

          <div className="flex items-center space-x-6 text-white/90">
            <button
              onClick={() => handleLike(parentMessage.id)}
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <Heart 
                className={parentMessage.isLiked ? 'fill-current text-red-500' : ''} 
                size={20} 
              />
              <span>{parentMessage.likes}</span>
            </button>
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>{messages.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye size={20} />
              <span>{parentMessage.viewCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl p-6 w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({messages.length})
        </h3>
        
        <div className="space-y-4 mb-6 w-full">
          <AnimatePresence mode="popLayout">
            {messages.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 p-4 rounded-xl w-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      {comment.isAnonymous ? 
                        getAnonDisplayName(comment.author.id)[0].toUpperCase() : 
                        comment.author.avatar ? (
                          <img 
                            src={comment.author.avatar} 
                            alt={comment.author.username} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          comment.author.username[0].toUpperCase()
                        )
                      }
                    </div>
                    <div>
                      <p className="font-medium">
                        {comment.isAnonymous 
                          ? getAnonDisplayName(comment.author.id)
                          : comment.author.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                  
                  {user?.id === comment.author.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                
                <div className="flex items-center space-x-2 mt-2">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  >
                    <Heart 
                      className={comment.isLiked ? 'fill-current text-red-500' : ''} 
                      size={16} 
                    />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="w-full">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Post anonymously</span>
            </label>
            <Button type="submit" disabled={!comment.trim()}>
              Post Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}