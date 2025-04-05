import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../common/Button';

interface ChatroomHeaderProps {
  onCreatePost: () => void;
}

export default function ChatroomHeader({ onCreatePost }: ChatroomHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-8 rounded-3xl mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gurlz Chatroom</h1>
          <p className="text-white/90">Explore stories, engage with others, and have fun!</p>
        </div>
        <Button onClick={onCreatePost} className="bg-white text-purple-500 hover:bg-white/90">
          <Plus size={20} className="mr-2" />
          Create New Post
        </Button>
      </div>
    </div>
  );
}