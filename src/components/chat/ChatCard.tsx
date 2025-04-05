<<<<<<< HEAD
import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Heart, Eye, AlertTriangle, Trash2 } from 'lucide-react';
=======
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Heart, Eye, AlertTriangle, Trash2, Flag } from 'lucide-react';
>>>>>>> master
import { useAuthStore } from '../../store/authStore';
import { useChat } from '../../hooks/useChat';

// Map to consistently assign anonymous names
const anonUserMap = new Map();
let anonCounter = 1;

// Function to get consistent anonymous names
const getAnonDisplayName = (userId) => {
  if (!anonUserMap.has(userId)) {
    anonUserMap.set(userId, `AnonGurl${anonCounter++}`);
  }
  return anonUserMap.get(userId);
};

interface ChatCardProps {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  isAnonymous: boolean;
  isSuitableForMinors?: boolean;
  timestamp: string;
  color: string;
  onClick: () => void;
  onDelete?: () => void;
<<<<<<< HEAD
  className?: string; // Added to allow additional styling
=======
  onReport?: (reason: string) => void; // Updated to accept a reason string
  className?: string; // Allows additional styling
>>>>>>> master
}

export default function ChatCard({
  id,
  content,
  author,
  isAnonymous,
  isSuitableForMinors = true,
  timestamp,
  color,
  onClick,
  onDelete,
<<<<<<< HEAD
  className = '', // Default to empty string
}: ChatCardProps) {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  
=======
  onReport, // Report callback
  className = '',
}: ChatCardProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

>>>>>>> master
  // Use the chat hook to get real-time metrics
  const { parentMessage, toggleLike } = useChat(id);

  const isAuthor = user?.id === author.id;
<<<<<<< HEAD
  
  // Use the new anonymous naming convention
  const displayName = isAnonymous 
    ? getAnonDisplayName(author.id)
    : (author?.username || 'Unknown User');
  
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
=======

  // Use the new anonymous naming convention
  const displayName = isAnonymous
    ? getAnonDisplayName(author.id)
    : (author?.username || 'Unknown User');

  // Get metrics from parentMessage if available, otherwise use defaults
  const metrics = parentMessage
    ? {
      likes: parentMessage.likes || 0,
      likedBy: parentMessage.likedBy || [],
      isLiked: parentMessage.isLiked || false,
      repliesCount: parentMessage.replies_count || 0,
      viewCount: parentMessage.viewCount || 0,
    }
    : {
      likes: 0,
      likedBy: [],
      isLiked: false,
      repliesCount: 0,
      viewCount: 0,
    };
>>>>>>> master

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

<<<<<<< HEAD
  return (
    <div
      onClick={onClick}
      className={`w-full p-6 rounded-xl text-left transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer ${color} ${className}`}
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
=======
  // Modal state for reporting
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Predefined violation options
  const violationOptions = [
    'Spam or misleading',
    'Harassment or bullying',
    'Hate speech or symbols',
    'Nudity or sexual content',
    'Other'
  ];

  const toggleViolation = (option: string) => {
    if (selectedViolations.includes(option)) {
      setSelectedViolations(selectedViolations.filter((v) => v !== option));
    } else {
      setSelectedViolations([...selectedViolations, option]);
    }
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    const violationsText = selectedViolations.join(', ') || 'No violation selected';
    const reason = `Violations: ${violationsText}. Additional info: ${additionalInfo}`;
    if (onReport) {
      onReport(reason);
    }
    setShowReportModal(false);
    // Reset modal state
    setSelectedViolations([]);
    setAdditionalInfo('');
  };

  const handleCancelReport = () => {
    setShowReportModal(false);
    setSelectedViolations([]);
    setAdditionalInfo('');
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`w-full p-6 rounded-xl text-left transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer ${color} ${className}`}
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
                <span className="text-lg font-bold text-white">
                  {displayName[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <button
                onClick={handleAuthorClick}
                className={`font-medium text-white hover:underline ${isAnonymous ? 'cursor-default hover:no-underline' : ''
                  }`}
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
            {/* Report button is shown if the user is not the author and onReport is provided */}
            {!isAuthor && onReport && (
              <button
                onClick={handleReportClick}
                className="text-white/70 hover:text-white transition-colors"
                title="Report message"
              >
                <Flag size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-white line-clamp-3 mb-4 whitespace-pre-wrap">
          {content}
        </p>

        {/* Metrics */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${metrics.isLiked ? 'text-red-300' : 'text-white/70 hover:text-white'
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in p-4">
          <div className="bg-secondary-light p-4 md:p-6 rounded-lg w-full max-w-md mx-2 shadow-xl">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary-dark">
              Report Message
            </h2>

            <p className="mb-2 md:mb-3 text-sm md:text-base text-primary-dark font-medium">
              Select the areas of violation:
            </p>

            <div className="mb-3 md:mb-4 space-y-2">
              {violationOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center text-primary-dark text-sm md:text-base"
                >
                  <input
                    type="checkbox"
                    checked={selectedViolations.includes(option)}
                    onChange={() => toggleViolation(option)}
                    className="mr-2 w-4 h-4 text-primary-dark border-2 border-primary-dark rounded focus:ring-primary-dark"
                  />
                  {option}
                </label>
              ))}
            </div>

            <p className="mb-2 text-sm md:text-base text-primary-dark font-medium">
              Additional details:
            </p>

            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full p-2 mb-4 text-sm md:text-base text-primary-dark bg-white border-2 border-primary-dark rounded-lg focus:ring-2 focus:ring-primary-dark"
              placeholder="Provide additional information (optional)"
              rows={3}
            />

            <div className="flex flex-col md:flex-row gap-2 md:gap-3 md:justify-end">
              <button
                onClick={handleCancelReport}
                className="w-full md:w-auto px-4 py-2 bg-secondary-dark text-primary-dark rounded-lg hover:bg-secondary font-medium transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="w-full md:w-auto px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary font-medium transition-colors text-sm md:text-base"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
>>>>>>> master
