import React from 'react';
import { format } from 'date-fns';
import { Heart, MessageCircle, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../../../types/chat';
import UserAvatar from '../../common/UserAvatar';

interface MessageCardProps {
  message: ChatMessage;
  onLike: () => void;
  isParentMessage?: boolean;
}

export default function MessageCard({ message, onLike, isParentMessage = false }: MessageCardProps) {
  if (!message) return null;

  const {
    content,
    author,
    isAnonymous,
    isSuitableForMinors,
    timestamp,
    likes = 0,
    comments = [],
    liked = false,
    color
  } = message;

  return (
    <div className={`${isParentMessage ? color : 'bg-white'} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-start space-x-3">
        <UserAvatar
          username={isAnonymous ? 'Anonymous' : author.username}
          avatarUrl={!isAnonymous ? author.avatar : undefined}
          isAnonymous={isAnonymous}
          size="md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {isAnonymous ? 'Anonymous' : author.username}
              </span>
              {!isSuitableForMinors && (
                <AlertTriangle className="text-yellow-500" size={16} />
              )}
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(timestamp), 'MMM d, h:mm a')}
            </span>
          </div>

          <p className="mt-2 text-gray-800 whitespace-pre-wrap">{content}</p>

          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={liked ? 'fill-current' : ''} size={18} />
              <span>{likes}</span>
            </button>
            {isParentMessage && (
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle size={18} />
                <span>{comments.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}