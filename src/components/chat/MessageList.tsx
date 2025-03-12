import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: ChatMessageType[];
  onLike: (messageId: string) => void;
  onReply: (messageId: string, content: string) => void;
}

export default function MessageList({ messages, onLike, onReply }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <p className="text-gray-500">No messages yet. Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </div>
  );
}