import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showStatus?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function UserAvatar({
  username,
  avatarUrl,
  isAnonymous = false,
  size = 'md',
  isOnline = false,
  showStatus = false,
  onClick,
  className = ''
}: UserAvatarProps) {
  // Size configurations
  const sizeConfig = {
    xs: {
      container: 'w-6 h-6',
      text: 'text-xs',
      icon: 12,
      status: 'w-1.5 h-1.5',
      statusOffset: '-right-0.5 -bottom-0.5'
    },
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      icon: 16,
      status: 'w-2 h-2',
      statusOffset: '-right-1 -bottom-1'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-base',
      icon: 20,
      status: 'w-2.5 h-2.5',
      statusOffset: '-right-1 -bottom-1'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-lg',
      icon: 24,
      status: 'w-3 h-3',
      statusOffset: '-right-1 -bottom-1'
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-xl',
      icon: 32,
      status: 'w-4 h-4',
      statusOffset: '-right-1.5 -bottom-1.5'
    }
  };

  // Base container classes
  const containerClasses = `
    relative
    flex
    items-center
    justify-center
    rounded-full
    bg-gradient-to-br
    overflow-hidden
    ${isAnonymous ? 'from-gray-400 to-gray-500' : 'from-primary/80 to-primary'}
    ${onClick ? 'cursor-pointer' : ''}
    ${sizeConfig[size].container}
    ${className}
  `;

  // Initial for avatar fallback
  const initial = username ? username[0].toUpperCase() : 'A';

  const AvatarContent = () => {
    if (isAnonymous) {
      return (
        <User 
          size={sizeConfig[size].icon}
          className="text-white"
        />
      );
    }

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={username}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = ''; // Clear broken image
          }}
        />
      );
    }

    return (
      <span className={`${sizeConfig[size].text} font-semibold text-white`}>
        {initial}
      </span>
    );
  };

  const Avatar = onClick ? motion.button : motion.div;

  return (
    <Avatar
      className={containerClasses}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <AvatarContent />
      
      {/* Online Status Indicator */}
      {showStatus && (
        <span 
          className={`
            absolute 
            ${sizeConfig[size].statusOffset}
            ${sizeConfig[size].status}
            rounded-full 
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            border-2 
            border-white
          `}
        />
      )}
    </Avatar>
  );
}