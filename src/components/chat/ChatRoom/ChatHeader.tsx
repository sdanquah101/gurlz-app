import React from 'react';
import { ArrowLeft, Share2, Heart, MessageSquare, Eye } from 'lucide-react';
import Button from '../../common/Button';

interface ChatHeaderProps {
  color: string;
  isAnonymous: boolean;
  username: string;
  onBack: () => void;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  onLike?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
  createdAt?: string;
}

export default function ChatHeader({ 
  color, 
  isAnonymous, 
  username, 
  onBack,
  likeCount = 0,
  commentCount = 0,
  viewCount = 0,
  onLike,
  onShare,
  isLiked = false,
  createdAt
}: ChatHeaderProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`${color} p-8 rounded-t-3xl flex-shrink-0`}>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onBack}
        className="mb-4 hover:bg-white/20 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Stories
      </Button>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {isAnonymous ? 'A' : username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isAnonymous ? 'Anonymous' : username}
              </h1>
              {createdAt && (
                <p className="text-white/70 text-sm">
                  {formatDate(createdAt)}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              variant="secondary"
              onClick={onLike}
              className={`hover:bg-white/20 transition-colors ${isLiked ? 'text-pink-500' : 'text-white'}`}
            >
              <Heart 
                size={20} 
                className={`mr-2 ${isLiked ? 'fill-current' : ''}`} 
              />
              {likeCount}
            </Button>

            <Button 
              variant="secondary"
              className="hover:bg-white/20 transition-colors text-white"
            >
              <MessageSquare size={20} className="mr-2" />
              {commentCount}
            </Button>

            <Button 
              variant="secondary"
              className="hover:bg-white/20 transition-colors text-white"
            >
              <Eye size={20} className="mr-2" />
              {viewCount}
            </Button>

            <Button 
              variant="secondary"
              onClick={onShare}
              className="hover:bg-white/20 transition-colors text-white"
            >
              <Share2 size={20} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}