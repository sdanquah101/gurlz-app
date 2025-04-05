import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Smile, AlertCircle } from 'lucide-react';
import Button from '../../common/Button';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (content: string, isAnonymous: boolean) => void;
  isLoading?: boolean;
}

export default function CreatePostModal({ 
  onClose, 
  onSubmit,
  isLoading = false 
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 500;
  const minLength = 10;

  useEffect(() => {
    // Focus textarea when modal opens
    textareaRef.current?.focus();

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    if (content.trim() && !confirm('Discard your story?')) {
      return;
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length >= minLength) {
      onSubmit(content.trim(), isAnonymous);
      onClose();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = 
        Math.min(textareaRef.current.scrollHeight, 400) + 'px';
    }
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Story</h2>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Share your story..."
              className={`w-full p-4 rounded-xl border-2 transition-colors resize-none
                ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'}
                min-h-[160px]`}
            />
            
            {/* Character count and warning */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Post anonymously
                </label>
              </div>
              <div className="flex items-center space-x-2">
                {content.length < minLength && content.length > 0 && (
                  <div className="flex items-center text-amber-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    Minimum {minLength} characters
                  </div>
                )}
                <span className={`text-sm ${
                  content.length > maxLength * 0.8 ? 'text-amber-500' : 'text-gray-500'
                }`}>
                  {charCount}/{maxLength}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                type="button"
                className="text-gray-500 hover:text-gray-700"
              >
                <Image size={20} />
              </Button>
              <Button
                variant="ghost"
                type="button"
                className="text-gray-500 hover:text-gray-700"
              >
                <Smile size={20} />
              </Button>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={content.length < minLength || isLoading}
                className={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              >
                {isLoading ? 'Posting...' : 'Post Story'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}