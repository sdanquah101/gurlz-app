import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lock } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryProps {
  chats?: ChatMessage[]; // Optional to handle undefined gracefully
}

export default function ChatHistory({ chats = [] }: ChatHistoryProps) {
  useEffect(() => {
    console.log('Chats received in ChatHistory:', chats);
  }, [chats]);

  if (!Array.isArray(chats) || chats.length === 0) {
    return <div className="text-center py-8 text-gray-500">No chat history yet</div>;
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'some time ago';
    }
  };

  return (
    <div className="space-y-4">
      {chats.map((chat, index) => {
        const likes = chat.likes ?? 0; // Default to 0 if undefined
        const repliesCount = chat.comments?.length ?? 0; // Default to 0 if undefined
        const formattedTimestamp = chat.timestamp
          ? formatTimestamp(chat.timestamp)
          : 'some time ago';

        return (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="text-primary" size={20} />
                <h4 className="font-medium text-gray-900">
                  {chat.isAnonymous ? 'Anonymous Message' : 'Message'}
                </h4>
                {chat.isAnonymous && <Lock className="text-gray-400" size={16} />}
              </div>
              <span className="text-sm text-gray-500">{formattedTimestamp}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{chat.content}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
              <span>{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
