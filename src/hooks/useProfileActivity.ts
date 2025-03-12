import { useCallback } from 'react';
import { useActivityStore } from '../store/activityStore';
import { useAuthStore } from '../store/authStore';
import { ActivityType } from '../types/profile';

export function useProfileActivity() {
  const { user } = useAuthStore();
  const { addActivity } = useActivityStore();

  const logActivity = useCallback((
    type: ActivityType,
    content: string,
    private_: boolean = false
  ) => {
    if (!user) return;

    addActivity({
      userId: user.id,
      type,
      content,
      private: private_,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  }, [user, addActivity]);

  return { logActivity };
}