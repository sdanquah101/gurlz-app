import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import EmojiPicker from './EmojiPicker';
import AgeCheckModal from './AgeCheckModal';
import { useProfileActivity } from '../../hooks/useProfileActivity';

interface MessageInputProps {
  onSendMessage: (content: string, isAnonymous: boolean, isSuitableForMinors: boolean) => Promise<boolean>;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [showAgeCheck, setShowAgeCheck] = useState(false);
  const { logActivity } = useProfileActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter a message before sending.');
      return;
    }
    if (sending) return;
    setShowAgeCheck(true);
  };

  const handleAgeConfirmation = async (isSuitableForMinors: boolean) => {
    setSending(true);
    try {
      const success = await onSendMessage(message, isAnonymous, isSuitableForMinors);
      if (success) {
        alert('Message sent successfully!');
        setMessage('');
        logActivity('chat', `Sent a ${isAnonymous ? 'anonymous ' : ''}message`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send the message. Please try again.');
    } finally {
      setSending(false);
      setShowAgeCheck(false);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded text-primary focus:ring-primary"
            disabled={sending}
          />
          <span>Post anonymously</span>
        </label>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            disabled={sending}
            aria-label="Message Input"
          />
          <div className="absolute bottom-3 right-3">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        <Button type="submit" disabled={sending}>
          <Send size={20} />
        </Button>
      </div>

      <AnimatePresence>
        {showAgeCheck && (
          <AgeCheckModal
            content={message}
            onConfirm={handleAgeConfirmation}
            onClose={() => setShowAgeCheck(false)}
          />
        )}
      </AnimatePresence>
    </form>
  );
}
