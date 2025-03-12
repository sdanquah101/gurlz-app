import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';
import ChatCard from '../ChatCard';
import Button from '../../common/Button';
import { Comment } from '../../../types/chat';

interface CommentListProps {
  comments: Comment[];
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'mostLiked';

export default function CommentList({ 
  comments, 
  onReply,
  onLike,
  onReport
}: CommentListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleExpand = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const sortComments = (commentsToSort: Comment[]): Comment[] => {
    return [...commentsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'mostLiked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  };

  // Wrap comment with indentation container instead of using marginLeft
  const renderComment = (comment: Comment, depth = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedComments.has(comment.id);

    return (
      <div key={comment.id} className="mb-3">
        {/* Comment container with full width */}
        <div className={depth > 0 ? `pl-6 border-l-2 border-gray-200 ml-6` : ''}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChatCard
              id={comment.id}
              content={comment.content}
              author={comment.author}
              isAnonymous={comment.isAnonymous}
              timestamp={comment.timestamp}
              likes={comment.likes}
              color={depth === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-100 hover:bg-gray-200"}
              onClick={() => {}}
              onReply={() => onReply?.(comment.id)}
              onLike={() => onLike?.(comment.id)}
              onReport={() => onReport?.(comment.id)}
              className="w-full" // Force full width
            />
            
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(comment.id)}
                className="ml-4 mt-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronDown
                  size={16}
                  className={`mr-1 transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
                {isExpanded ? 'Hide' : 'Show'} {comment.replies!.length} replies
              </Button>
            )}
          </motion.div>

          {hasReplies && isExpanded && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full" // Ensure replies container is full width
              >
                {sortComments(comment.replies!).map(reply =>
                  renderComment(reply, depth + 1)
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 w-full">
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 p-2 border-b w-full">
        <h3 className="font-semibold text-gray-700">
          {comments.length} Comments
        </h3>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border-none bg-transparent text-gray-700 focus:ring-0 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Comments with full width */}
      <div className="space-y-3 w-full">
        {sortComments(comments).map(comment => renderComment(comment))}
      </div>
    </div>
  );
}