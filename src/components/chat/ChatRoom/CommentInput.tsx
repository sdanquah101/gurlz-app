import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, AtSign, X } from 'lucide-react';
import Button from '../../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentInputProps {
  comment: string;
  isAnonymous: boolean;
  onCommentChange: (value: string) => void;
  onAnonymousChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  replyingTo?: string;
  onCancelReply?: () => void;
  maxLength?: number;
}

export default function CommentInput({
  comment,
  isAnonymous,
  onCommentChange,
  onAnonymousChange,
  onSubmit,
  replyingTo,
  onCancelReply,
  maxLength = 500
}: CommentInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
      setRows(Math.ceil(Math.min(inputRef.current.scrollHeight, 150) / 24)); // 24px line height
    }
  }, [comment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && comment.length <= maxLength) {
      onSubmit(e);
      // Reset rows after submission
      setRows(1);
    }
  };

  return (
    <div className={`border-t bg-white p-3 transition-all ${isFocused ? 'shadow-lg' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Reply indicator */}
        {replyingTo && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded"
          >
            <div className="flex items-center">
              <AtSign size={14} className="mr-1" />
              <span>Replying to {replyingTo}</span>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {/* Main input area */}
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Share your thoughts..."
              rows={rows}
              maxLength={maxLength}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 
                focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none
                placeholder:text-gray-400"
            />
            
            {/* Character counter */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {comment.length}/{maxLength}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Anonymous toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => onAnonymousChange(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                  id="anonymous"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Post anonymously
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image size={18} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Smile size={18} />
                </Button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!comment.trim() || comment.length > maxLength}
              className="px-4 py-2"
            >
              <Send size={16} className="mr-2" />
              {replyingTo ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}