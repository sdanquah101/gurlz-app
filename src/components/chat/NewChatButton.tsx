import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import AgeCheckModal from './AgeCheckModal';

interface NewChatButtonProps {
  onNewChat: (content: string, isAnonymous: boolean, isSuitableForMinors: boolean) => void;
}

export default function NewChatButton({ onNewChat }: NewChatButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAgeCheck, setShowAgeCheck] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setShowAgeCheck(true);
  };

  const handleAgeConfirmation = (isSuitableForMinors: boolean) => {
    onNewChat(content, isAnonymous, isSuitableForMinors);
    setContent('');
    setShowForm(false);
    setShowAgeCheck(false);
  };

  return (
    <div>
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus size={20} className="mr-2" />
          Start Conversation
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={4}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Post anonymously</span>
            </label>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim()}>
                Post
              </Button>
            </div>
          </div>
        </form>
      )}

      <AnimatePresence>
        {showAgeCheck && (
          <AgeCheckModal
            content={content}
            onConfirm={handleAgeConfirmation}
            onClose={() => setShowAgeCheck(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}