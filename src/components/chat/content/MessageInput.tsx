import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../../common/Button';
import EmojiPicker from '../EmojiPicker';

interface MessageInputProps {
  onSendMessage: (content: string, isAnonymous: boolean) => void;
  isComment?: boolean;
}

export default function MessageInput({ onSendMessage, isComment = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message.trim(), isAnonymous);
    setMessage('');
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isComment ? "Write a comment..." : "Type your message..."}
            className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
          />
          <div className="absolute bottom-3 right-3">
            <EmojiPicker onEmojiSelect={(emoji) => setMessage(prev => prev + emoji.native)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">Post anonymously</span>
          </label>

          <Button type="submit" disabled={!message.trim()}>
            <Send size={18} className="mr-2" />
            {isComment ? 'Comment' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}