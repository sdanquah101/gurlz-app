import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../common/Button';
import { ChatRoom } from '../../types/chat';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  onCreateRoom: () => void;
}

export default function ChatSidebar({ rooms, onCreateRoom }: ChatSidebarProps) {
  const location = useLocation();

  return (
    <div className="w-64 bg-white rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-primary">Chat Rooms</h3>
        <Button size="sm" onClick={onCreateRoom}>
          <Plus size={16} className="mr-1" />
          New
        </Button>
      </div>

      <div className="space-y-2">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={`/chat/${room.category}`}
            className={`block px-3 py-2 rounded-lg transition-colors
              ${location.pathname === `/chat/${room.category}`
                ? 'bg-primary text-white'
                : 'hover:bg-gray-50 text-gray-700'
              }`}
          >
            <div className="text-sm font-medium">{room.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}