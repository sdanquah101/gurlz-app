import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { ChatMessage } from '../../../types/chat';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

interface StoryViewProps {
  story: ChatMessage;
  onBack: () => void;
  onLike: () => void;
  onShare: () => void;
  onComment: (content: string, isAnonymous: boolean) => void;
}

export default function StoryView({
  story,
  onBack,
  onLike,
  onShare,
  onComment
}: StoryViewProps) {
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onComment(comment, isAnonymous);
    setComment('');
    setIsAnonymous(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatHeader
        color={story.color}
        isAnonymous={story.isAnonymous}
        username={story.author.username}
        onBack={onBack}
        likeCount={story.likes}
        commentCount={story.comments.length}
        viewCount={story.viewCount}
        onLike={onLike}
        onShare={onShare}
        isLiked={story.liked}
        createdAt={story.timestamp}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ChatContent
            content={story.content}
            likes={story.likes}
            commentsCount={story.comments.length}
            viewCount={story.viewCount}
            liked={story.liked}
            onLike={onLike}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Comments ({story.comments.length})
            </h2>
          </div>

          <CommentList comments={story.comments} />

          {user ? (
            <div className="border-t">
              <CommentInput
                comment={comment}
                isAnonymous={isAnonymous}
                onCommentChange={setComment}
                onAnonymousChange={setIsAnonymous}
                onSubmit={handleSubmitComment}
              />
            </div>
          ) : (
            <div className="p-4 text-center border-t">
              <p className="text-gray-500">
                Please log in to comment
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}