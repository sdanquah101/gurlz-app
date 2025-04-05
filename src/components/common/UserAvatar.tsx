import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  isAnonymous?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  isOnline?: boolean;
}

export default function UserAvatar({
  username,
  avatarUrl,
  isAnonymous = false,
  size = 'md',
  showStatus = false,
  isOnline = false
}: UserAvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initial = username ? username[0].toUpperCase() : 'A';

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden
        ${isAnonymous ? 'bg-gray-200' : 'bg-primary/10'}`}
      >
        {isAnonymous ? (
          <User className="text-gray-500" size={size === 'lg' ? 24 : 20} />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold text-primary">{initial}</span>
        )}
      </div>

      {showStatus && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
          ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
        />
      )}
    </div>
  );
}