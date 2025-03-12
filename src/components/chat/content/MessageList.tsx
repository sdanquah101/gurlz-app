import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../../types/chat';
import MessageCard from './MessageCard';

interface MessageListProps {
  messages: ChatMessage[];
  onLikeMessage: (messageId: string) => void;
  isParentMessage?: boolean;
  isComment?: boolean;
}

export default function MessageList({ 
  messages, 
  onLikeMessage,
  isParentMessage = false,
  isComment = false
}: MessageListProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {messages.map((message) => (
        <motion.div
          key={`message-${message.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          layout
          className={isComment ? 'ml-8' : ''}
        >
          <MessageCard
            message={message}
            onLike={() => onLikeMessage(message.id)}
            isParentMessage={isParentMessage}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}