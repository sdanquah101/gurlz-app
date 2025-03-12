import { useState, useEffect } from 'react';
import { localChat } from '../lib/local/chat';
import { ChatRoom } from '../types/chat';

export function useChatrooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const allRooms = localChat.getRooms();
      setRooms(allRooms);
    } catch (err) {
      setError('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  return { rooms, loading, error };
}