import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserActivity } from '../types/profile';

interface ActivityStore {
  activities: UserActivity[];
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  getActivitiesByUser: (userId: string) => UserActivity[];
  clearActivities: () => void;
}

const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (activity) => set((state) => {
        const timestamp = new Date();
        console.log('Adding activity:', { ...activity, timestamp });
        
        return {
          activities: [
            {
              ...activity,
              id: Date.now().toString(),
              timestamp
            },
            ...state.activities
          ].slice(0, 100) // Keep only last 100 activities
        };
      }),
      
      getActivitiesByUser: (userId) => {
        const activities = get().activities;
        console.log('Getting activities for user:', userId, activities);
        
        return activities
          .filter(activity => activity.userId === userId)
          .map(activity => ({
            ...activity,
            // Ensure timestamp is always a valid Date
            timestamp: isValidDate(activity.timestamp) 
              ? activity.timestamp 
              : new Date(activity.timestamp)
          }))
          .sort((a, b) => {
            const dateA = isValidDate(a.timestamp) ? a.timestamp.getTime() : 0;
            const dateB = isValidDate(b.timestamp) ? b.timestamp.getTime() : 0;
            return dateB - dateA;
          });
      },

      clearActivities: () => set({ activities: [] })
    }),
    {
      name: 'activity-storage',
      partialize: (state) => {
        console.log('Serializing state:', state);
        return {
          activities: state.activities.map(activity => ({
            ...activity,
            timestamp: activity.timestamp instanceof Date 
              ? activity.timestamp.toISOString()
              : activity.timestamp
          }))
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Rehydrating state:', state);
          // Convert ISO strings back to Date objects
          state.activities = state.activities.map(activity => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
          }));
        }
      }
    }
  )
);