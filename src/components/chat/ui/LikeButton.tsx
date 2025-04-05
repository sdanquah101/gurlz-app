import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  count: number;
  isLiked: boolean;
  onLike: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function LikeButton({
  count,
  isLiked,
  onLike,
  size = 'md',
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onLike();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'p-1',
      icon: 16,
      text: 'text-xs'
    },
    md: {
      button: 'p-1.5',
      icon: 20,
      text: 'text-sm'
    },
    lg: {
      button: 'p-2',
      icon: 24,
      text: 'text-base'
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`group rounded-full ${sizeConfig[size].button} 
          ${isLiked 
            ? 'text-pink-500' 
            : 'text-gray-400 hover:text-pink-500'
          } transition-colors relative`}
      >
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            size={sizeConfig[size].icon} 
            className={`transition-colors ${isLiked ? 'fill-current' : 'fill-transparent'}`}
          />
        </motion.div>

        {/* Like animation effect */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 text-pink-500"
            >
              <Heart 
                size={sizeConfig[size].icon} 
                className="fill-current"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {showCount && (
        <motion.span
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${sizeConfig[size].text} ${
            isLiked ? 'text-pink-500' : 'text-gray-500'
          }`}
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}