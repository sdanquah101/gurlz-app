import React from 'react';
import { ChatMessage } from '../../../types/chat';
import { useAuthStore } from '../../../store/authStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatContentProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, isAnonymous: boolean, isSuitableForMinors: boolean) => void;
  onLikeMessage: (messageId: string) => void;
}

export default function ChatContent({ messages, onSendMessage, onLikeMessage }: ChatContentProps) {
  const user = useAuthStore(state => state.user);
  const isUserOver18 = user?.ageGroup !== '12-18';

  // Filter messages based on age appropriateness
  const filteredMessages = messages.filter(message => {
    if (message.isSuitableForMinors) return true;
    return isUserOver18;
  });

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={filteredMessages} onLikeMessage={onLikeMessage} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}