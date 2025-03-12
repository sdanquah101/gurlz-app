import { useState, useEffect } from 'react';
import { localChat } from '../lib/local/chat';
import { ChatRoom } from '../types/chat';

export function useChatroom(category: string) {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      const foundRoom = localChat.getRoomByCategory(category);
      if (foundRoom) {
        setRoom(foundRoom);
      } else {
        setError('Chat room not found');
      }
      setLoading(false);
    }
  }, [category]);

  return { room, loading, error };
}