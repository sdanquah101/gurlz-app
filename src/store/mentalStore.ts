import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MoodEntry {
  mood: string;
  note: string;
  timestamp: Date;
}

interface MentalState {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  getMoodHistory: () => MoodEntry[];
}

export const useMentalStore = create<MentalState>()(
  persist(
    (set, get) => ({
      moodEntries: [],
      addMoodEntry: (entry) => set((state) => ({
        moodEntries: [entry, ...state.moodEntries]
      })),
      getMoodHistory: () => get().moodEntries,
    }),
    {
      name: 'mental-storage'
    }
  )
);