import { OnlineStats } from '../../types/presence';

// Mock online stats
const mockStats: OnlineStats = {
  total: 100,
  online: 45,
  away: 15
};

export const localPresence = {
  getOnlineStats: () => ({ ...mockStats })
};