import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronDown, MoreVertical } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useChatStore } from '../../../store/chatStore';
import { Comment } from '../../../types/chat';
import CommentInput from './CommentInput';
import Button from '../../common/Button';

interface CommentThreadProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

export default function CommentThread({
  comment,
  depth = 0,
  maxDepth = 3
}: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const user = useAuthStore(state => state.user);
  const { addComment, likeComment, deleteComment } = useChatStore();

  const hasReplies = comment.replies && comment.replies.length > 0;
  const canReply = depth < maxDepth;
  const isAuthor = user?.id === comment.author.id;

  const handleReply = (content: string, isAnonymous: boolean) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      isAnonymous,
      timestamp: new Date().toISOString(),
      likes: 0,
      parentId: comment.id,
      replies: []
    };

    addComment(newComment);
    setIsReplying(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment.id);
    }
    setShowOptions(false);
  };

  return (
    <div className={`relative ${depth > 0 ? 'ml-6' : ''}`}>
      {/* Comment Thread Line */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 -ml-3"
          style={{ height: 'calc(100% - 20px)' }}
        />
      )}

      {/* Main Comment */}
      <div className={`relative bg-white rounded-lg p-4 ${depth > 0 ? 'border border-gray-100' : ''}`}>
        {/* Author Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {comment.isAnonymous ? (
                <span className="text-sm text-gray-500">A</span>
              ) : (
                comment.author.avatar ? (
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    {comment.author.username[0].toUpperCase()}
                  </span>
                )
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {comment.isAnonymous ? 'Anonymous' : comment.author.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Comment Options */}
          {isAuthor && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreVertical size={16} />
              </Button>
              {showOptions && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-gray-800 mb-3">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => likeComment(comment.id)}
            className={`flex items-center space-x-1 ${
              comment.isLiked ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{comment.likes || 0} likes</span>
          </button>
          
          {canReply && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle size={14} />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <CommentInput
                comment=""
                isAnonymous={false}
                onCommentChange={() => {}}
                onAnonymousChange={() => {}}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const content = (form.elements.namedItem('comment') as HTMLInputElement).value;
                  const isAnonymous = (form.elements.namedItem('anonymous') as HTMLInputElement).checked;
                  handleReply(content, isAnonymous);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Replies */}
      {hasReplies && (
        <div className="mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ChevronDown
              size={16}
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
            <span className="ml-1">
              {isExpanded ? 'Hide' : 'Show'} {comment.replies?.length} replies
            </span>
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {comment.replies?.map((reply) => (
                  <CommentThread
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}