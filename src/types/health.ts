// src/types/health.ts

// Cycle data from database
export interface CycleData {
  id?: string;
  user_id?: string;
  startDate: Date | string;
  endDate: Date | string;
  length: number;
  created_at?: string;
}

// Daily log entry
export interface LogEntry {
  id?: string;
  user_id?: string;
  date: Date | string;
  flow?: FlowLevel;
  mood?: MoodType;
  symptoms: SymptomType[];
  notes?: string;
  created_at?: string;
}

// Cycle phases
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'unknown';

// Flow levels
export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy';

// Mood types
export type MoodType = 'happy' | 'calm' | 'energetic' | 'tired' | 'sad' | 'neutral';

// Symptom types
export type SymptomType = 
  | 'cramps' 
  | 'headache' 
  | 'bloating' 
  | 'backache' 
  | 'tender_breasts' 
  | 'acne' 
  | 'fatigue' 
  | 'cravings' 
  | 'nausea'
  | 'spotting'
  | 'insomnia'
  | 'mood_swings'
  | 'anxiety'
  | 'constipation'
  | 'diarrhea'
  | 'dizziness'
  | 'hot_flashes'
  | 'libido_high'
  | 'libido_low'
  | 'ovulation_pain';

// Prediction result
export interface Prediction {
  message: string;
  predictions: {
    predictedNextPeriodStart: Date | null;
    predictedNextPeriodEnd: Date | null;
    estimatedOvulationDate: Date | null;
    fertileWindow: { start: Date; end: Date } | null;
  } | null;
}

// User settings
export interface UserSettings {
  cycleLength: number;
  periodLength: number;
  lastPeriodStart?: Date | string | null;
  notifications: {
    periodReminders: boolean;
    fertileWindowReminders: boolean;
    medicationReminders: boolean;
    timeOfDay?: string;
  };
  trackingFeatures: {
    flow: boolean;
    mood: boolean;
    symptoms: boolean;
    notes: boolean;
    temperature: boolean;
    weight: boolean;
    sleep: boolean;
    exercise: boolean;
  };
}

// Health insights
export interface Insight {
  id: string;
  type: 'nutrition' | 'exercise' | 'symptom' | 'cycle' | 'sleep' | 'general';
  phase: CyclePhase | 'all';
  title: string;
  content: string;
  source?: string;
  imageUrl?: string;
  createdAt: Date | string;
}

// Health store state
export interface HealthStoreState {
  cycles: CycleData[];
  logEntries: LogEntry[];
  predictions: Prediction | null;
  insights: Insight[];
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}