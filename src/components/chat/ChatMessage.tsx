import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useChat } from '../../hooks/useChat';
import ChatHeader from './ChatHeader';
import MessageList from './content/MessageList';
import MessageInput from './content/MessageInput';

export default function ChatRoom() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { 
    messages, 
    parentMessage, 
    loading, 
    error, 
    sendMessage, 
    likeMessage 
  } = useChat(chatId);

  const handleSendMessage = async (content: string, isAnonymous: boolean = false) => {
    if (!user || !content.trim()) return false;
    return await sendMessage(content, isAnonymous);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader onBack={() => navigate('/chat')} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader onBack={() => navigate('/chat')} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!chatId || !parentMessage) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader onBack={() => navigate('/chat')} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Message not found</p>
        </div>
      </div>
    );
  }

  const getAuthorDisplayName = (isAnonymous: boolean, username: string) => {
    return isAnonymous ? 'Anonymous' : username;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader 
        title={getAuthorDisplayName(parentMessage.isAnonymous, parentMessage.author.username)}
        onBack={() => navigate('/chat')} 
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Parent Message */}
          <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-2">
            <MessageList 
              messages={[parentMessage]} 
              onLikeMessage={likeMessage}
              isParentMessage={true}
            />
          </div>
          
          {/* Replies */}
          <div className="space-y-4 pt-4">
            {messages.length > 0 ? (
              <MessageList
                messages={messages}
                onLikeMessage={likeMessage}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No replies yet. Be the first to reply!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput 
            onSendMessage={handleSendMessage}
            placeholder="Write a reply..."
          />
        </div>
      </div>
    </div>
  );
}