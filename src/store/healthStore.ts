import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getCyclePredictions } from '../utils/periodTracking';
import { differenceInDays } from 'date-fns';

export interface CycleData {
  id?: string;
  user_id?: string;
  startDate: Date | string; // Kept camelCase for frontend consistency
  endDate: Date | string;   // Kept camelCase for frontend consistency
  length: number;
  created_at?: string;
}

export interface SymptomData {
  id?: string;
  user_id?: string;
  date: Date | string;
  symptoms: string[];      // Array of symptom identifiers
  intensity: number;       // 1-5 scale (default to 1 if not using intensity UI)
  note?: string;           // Optional notes
  cycle_day?: number;      // Optional cycle day
  created_at?: string;
}

export interface HealthStore {
  // Cycle-related state
  cycles: CycleData[];
  loading: boolean;
  error: string | null;
  
  // Symptom-related state
  symptoms: SymptomData[];
  symptomLoading: boolean;
  symptomError: string | null;
  
  // Cycle methods
  fetchCycles: () => Promise<void>;
  addCycle: (cycle: { startDate: Date, endDate: Date }) => Promise<void>;
  removeCycle: (id: string) => Promise<void>;
  getPredictions: () => any;
  
  // Symptom methods
  fetchSymptoms: () => Promise<void>;
  addSymptom: (symptomData: Omit<SymptomData, 'id' | 'user_id' | 'created_at'>) => Promise<SymptomData>;
  removeSymptom: (id: string) => Promise<void>;
  updateSymptom: (id: string, updateData: Partial<Omit<SymptomData, 'id' | 'user_id' | 'created_at'>>) => Promise<SymptomData>;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  // Initial cycle state
  cycles: [],
  loading: false,
  error: null,
  
  // Initial symptom state
  symptoms: [],
  symptomLoading: false,
  symptomError: null,
  
  // Cycle methods (existing)
  fetchCycles: async () => {
    set({ loading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch cycles from Supabase
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Convert string dates to Date objects and map snake_case to camelCase for frontend
      const formattedCycles = data.map(cycle => ({
        id: cycle.id,
        user_id: cycle.user_id,
        startDate: new Date(cycle.start_date),
        endDate: new Date(cycle.end_date),
        length: cycle.length,
        created_at: cycle.created_at
      }));

      set({ cycles: formattedCycles, loading: false });
    } catch (error) {
      console.error('Error fetching cycles:', error);
      set({ error: error.message, loading: false });
    }
  },

  addCycle: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate correct length - the difference in days plus 1 (inclusive)
      const diffDays = differenceInDays(endDate, startDate) + 1;

      // Check for overlaps with existing cycles
      const { cycles } = get();
      const isOverlap = cycles.some(
        (cycle) =>
          new Date(cycle.startDate) <= endDate && 
          new Date(cycle.endDate) >= startDate
      );

      if (isOverlap) {
        throw new Error('The selected date range overlaps with an existing period.');
      }

      // Insert new cycle - note the snake_case column names for the database
      const { data, error } = await supabase
        .from('cycles')
        .insert({
          user_id: user.id,
          start_date: startDate.toISOString(), // snake_case for database
          end_date: endDate.toISOString(),     // snake_case for database
          length: diffDays,
        })
        .select();

      if (error) throw error;

      // Refresh cycles
      await get().fetchCycles();
    } catch (error) {
      console.error('Error adding cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  removeCycle: async (id) => {
    set({ loading: true, error: null });
    try {
      // Delete cycle
      const { error } = await supabase
        .from('cycles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh cycles
      await get().fetchCycles();
    } catch (error) {
      console.error('Error removing cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  getPredictions: () => {
    const { cycles } = get();
    
    // Only generate predictions if there's at least one logged cycle
    if (!cycles || cycles.length === 0) {
      return { 
        message: "Not enough data for predictions", 
        predictions: null 
      };
    }
    
    // Format cycles for the prediction algorithm
    const periods = cycles.map((cycle) => ({
      start: new Date(cycle.startDate).toISOString().split('T')[0],
      end: new Date(cycle.endDate).toISOString().split('T')[0],
    }));
    
    return getCyclePredictions({ periods });
  },
  
  // Updated symptom methods
  fetchSymptoms: async () => {
    set({ symptomLoading: true, symptomError: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch symptoms from Supabase - using symptom_logs instead of symptoms table
      const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Format symptom data for frontend
      const formattedSymptoms = data.map(symptom => ({
        id: symptom.id,
        user_id: symptom.user_id,
        date: new Date(symptom.date),
        symptoms: symptom.symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: symptom.cycle_day,
        created_at: symptom.created_at
      }));

      set({ symptoms: formattedSymptoms, symptomLoading: false });
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
    }
  },

  addSymptom: async (symptomData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      // Input validation
      if (!symptomData.date) throw new Error('Symptom date is required');
      if (!symptomData.symptoms || symptomData.symptoms.length === 0) {
        throw new Error('At least one symptom is required');
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Format date for database
      const formattedDate = typeof symptomData.date === 'string' 
        ? symptomData.date 
        : symptomData.date.toISOString().split('T')[0];

      // Insert new symptom to symptom_logs table
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
          user_id: user.id,
          date: formattedDate,
          symptoms: symptomData.symptoms,
          cycle_day: symptomData.cycle_day || null
        })
        .select();

      if (error) throw error;

      // Format the returned data
      const newSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at
      };

      // Update local state
      set(state => ({
        symptoms: [...state.symptoms, newSymptom],
        symptomLoading: false
      }));

      return newSymptom;
    } catch (error) {
      console.error('Error saving symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  removeSymptom: async (id) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      // Delete symptom from symptom_logs table
      const { error } = await supabase
        .from('symptom_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        symptoms: state.symptoms.filter(s => s.id !== id),
        symptomLoading: false
      }));
    } catch (error) {
      console.error('Error removing symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  updateSymptom: async (id, updateData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      // Format data for database
      const dbUpdateData: any = {};
      
      if (updateData.date) {
        dbUpdateData.date = typeof updateData.date === 'string'
          ? updateData.date
          : updateData.date.toISOString().split('T')[0];
      }
      
      if (updateData.symptoms) dbUpdateData.symptoms = updateData.symptoms;
      if ('cycle_day' in updateData) dbUpdateData.cycle_day = updateData.cycle_day || null;

      // Update symptom in symptom_logs table
      const { data, error } = await supabase
        .from('symptom_logs')
        .update(dbUpdateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Format the returned data
      const updatedSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at
      };

      // Update local state
      set(state => ({
        symptoms: state.symptoms.map(s => s.id === id ? updatedSymptom : s),
        symptomLoading: false
      }));

      return updatedSymptom;
    } catch (error) {
      console.error('Error updating symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  }
}));