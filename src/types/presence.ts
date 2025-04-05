export type UserStatus = 'online' | 'offline' | 'away';

export interface UserPresence {
  user_id: string;
  last_seen: string;
  status: UserStatus;
  updated_at: string;
}

export interface OnlineStats {
  total: number;
  online: number;
  away: number;
}