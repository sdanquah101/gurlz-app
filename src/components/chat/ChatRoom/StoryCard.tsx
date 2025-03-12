import React from 'react';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryCardProps {
  content: string;
  author: string;
  likes: number;
  comments: number;
  views: number;
  color: string;
  onLike: () => void;
  onClick: () => void;
  liked?: boolean;
}

export default function StoryCard({
  content,
  author,
  likes,
  comments,
  views,
  color,
  onLike,
  onClick,
  liked
}: StoryCardProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${color} p-6 rounded-xl cursor-pointer`}
    >
      <p className="text-gray-800 line-clamp-4 mb-4">{content}</p>
      <p className="text-gray-600 mb-4">- {author}</p>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
        >
          <Heart className={liked ? 'fill-red-500 text-red-500' : ''} size={18} />
          <span className="text-sm">{likes}</span>
        </button>
        <div className="flex items-center space-x-1 text-gray-600">
          <MessageCircle size={18} />
          <span className="text-sm">{comments}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Eye size={18} />
          <span className="text-sm">{views}</span>
        </div>
      </div>
    </motion.div>
  );
}