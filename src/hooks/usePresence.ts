import { useState, useEffect } from 'react';
import { OnlineStats } from '../types/presence';
import { localPresence } from '../lib/local/presence';

export function usePresence() {
  const [onlineStats, setOnlineStats] = useState<OnlineStats>({
    total: 0,
    online: 0,
    away: 0
  });

  useEffect(() => {
    const stats = localPresence.getOnlineStats();
    setOnlineStats(stats);
  }, []);

  return { onlineStats };
}