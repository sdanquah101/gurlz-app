import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Heart, Eye, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useChat } from '../../hooks/useChat';

interface ChatCardProps {
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
  color: string;
  onClick: () => void;
  onDelete?: () => void;
}

export default function ChatCard({
  id,
  content,
  author,
  isAnonymous,
  isSuitableForMinors,
  timestamp,
  color,
  onClick,
  onDelete,
}: ChatCardProps) {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  
  // Use the chat hook to get real-time metrics
  const { parentMessage, toggleLike } = useChat(id);

  const isAuthor = user?.id === author.id;
  const displayName = isAnonymous ? 'Anonymous' : (author?.username || 'Unknown User');
  
  // Get metrics from parentMessage if available, otherwise use defaults
  const metrics = parentMessage ? {
    likes: parentMessage.likes || 0,
    likedBy: parentMessage.likedBy || [],
    isLiked: parentMessage.isLiked || false,
    repliesCount: parentMessage.replies_count || 0,
    viewCount: parentMessage.viewCount || 0,
  } : {
    likes: 0,
    likedBy: [],
    isLiked: false,
    repliesCount: 0,
    viewCount: 0,
  };

  const canLike = user && !metrics.likedBy.includes(user.id);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      const date = parseISO(dateString);
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (canLike) {
      toggleLike(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete?.();
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAnonymous && author?.id) {
      navigate(`/profile/${author.id}`);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-full p-6 rounded-xl text-left transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer ${color}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {isAnonymous ? (
              <User className="w-5 h-5 text-white" />
            ) : author?.avatar ? (
              <img
                src={author.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">{displayName[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <button
              onClick={handleAuthorClick}
              className={`font-medium text-white hover:underline ${isAnonymous ? 'cursor-default hover:no-underline' : ''}`}
            >
              {displayName}
            </button>
            <p className="text-sm text-white/70">{formatDate(timestamp)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isSuitableForMinors && (
            <AlertTriangle className="text-yellow-300" size={20} />
          )}
          {isAuthor && onDelete && (
            <button
              onClick={handleDelete}
              className="text-white/70 hover:text-white transition-colors"
              title="Delete message"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-white line-clamp-3 mb-4 whitespace-pre-wrap">{content}</p>

      {/* Metrics */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            metrics.isLiked ? 'text-red-300' : 'text-white/70 hover:text-white'
          } ${!canLike ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!canLike}
        >
          <Heart className={metrics.isLiked ? 'fill-current' : ''} size={18} />
          <span>{metrics.likes}</span>
        </button>
        <div className="flex items-center space-x-1 text-white/70">
          <MessageCircle size={18} />
          <span>{metrics.repliesCount}</span>
        </div>
        <div className="flex items-center space-x-1 text-white/70">
          <Eye size={18} />
          <span>{metrics.viewCount}</span>
        </div>
      </div>
    </div>
  );
}