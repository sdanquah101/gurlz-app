import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatContentProps {
  content: string;
  likes: number;
  commentsCount: number;
  viewCount: number;
  liked?: boolean;
  bookmarked?: boolean;
  onLike: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function ChatContent({ 
  content, 
  likes, 
  commentsCount, 
  viewCount,
  liked = false,
  bookmarked = false,
  onLike,
  onBookmark,
  onShare,
  className = ''
}: ChatContentProps) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = () => {
    setIsLikeAnimating(true);
    onLike();
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  return (
    <div className={`p-6 bg-white rounded-2xl shadow-sm ${className}`}>
      {/* Content Section */}
      <div className="prose max-w-none">
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-4" />

      {/* Engagement Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            className={`flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors
              ${liked ? 'text-pink-500' : ''}`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isLikeAnimating ? { scale: [1, 1.2, 1] } : {}}
            >
              <Heart 
                size={20} 
                className={`transition-colors ${liked ? 'fill-pink-500 text-pink-500' : ''}`} 
              />
            </motion.div>
            <span className="font-medium">{likes}</span>
          </motion.button>

          {/* Comments Counter */}
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle size={20} />
            <span className="font-medium">{commentsCount} comments</span>
          </div>

          {/* View Counter */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Eye size={20} />
            <span className="font-medium">{viewCount} views</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Bookmark Button */}
          <motion.button
            onClick={onBookmark}
            className={`text-gray-600 hover:text-blue-500 transition-colors
              ${bookmarked ? 'text-blue-500' : ''}`}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark 
              size={20} 
              className={bookmarked ? 'fill-current' : ''} 
            />
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={onShare}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}