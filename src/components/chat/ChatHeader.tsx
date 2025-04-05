import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../common/Button';

interface ChatHeaderProps {
  title?: string;
  onBack: () => void;
}

export default function ChatHeader({ title = 'Chat Room', onBack }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b p-4 flex items-center space-x-4">
      <Button variant="ghost" onClick={onBack} size="sm">
        <ArrowLeft size={20} />
      </Button>
      
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">Share and connect with others</p>
      </div>
    </div>
  );
}