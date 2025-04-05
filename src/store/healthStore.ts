import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getCyclePredictions } from '../utils/periodTracking';
import { differenceInDays, format } from 'date-fns';

export interface CycleData {
  id?: string;
  user_id?: string;
  startDate: Date | string;
  endDate: Date | string;
  length: number;
  created_at?: string;
}

export interface SymptomData {
  id?: string;
  user_id?: string;
  date: Date | string;
  symptoms: string[];
  intensity: number;
  note?: string;
  cycle_day?: number;
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
  addCycle: (cycle: { startDate: Date; endDate: Date }) => Promise<void>;
  removeCycle: (id: string) => Promise<void>;
  getPredictions: () => any;

  // Symptom methods
  fetchSymptoms: () => Promise<void>;
  addSymptom: (
    symptomData: Omit<SymptomData, 'id' | 'user_id' | 'created_at'>
  ) => Promise<SymptomData>;
  removeSymptom: (id: string) => Promise<void>;
  updateSymptom: (
    id: string,
    updateData: Partial<Omit<SymptomData, 'id' | 'user_id' | 'created_at'>>
  ) => Promise<SymptomData>;
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

  /**
   * -------------
   *  Cycle Methods
   * -------------
   */

  // Fetch all cycles (actual only) from Supabase and store them
  fetchCycles: async () => {
    set({ loading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });
      if (error) throw error;

      // Convert snake_case to camelCase and string -> Date
      const formattedCycles = data.map((cycle: any) => ({
        id: cycle.id,
        user_id: cycle.user_id,
        startDate: new Date(cycle.start_date),
        endDate: new Date(cycle.end_date),
        length: cycle.length,
        created_at: cycle.created_at,
      }));

      set({ cycles: formattedCycles, loading: false });
    } catch (error: any) {
      console.error('Error fetching cycles:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Add a new actual cycle to Supabase – overlapping periods are allowed.
  addCycle: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use date-fns to format dates as "yyyy-MM-dd"
      const newStartStr = format(startDate, 'yyyy-MM-dd');
      const newEndStr = format(endDate, 'yyyy-MM-dd');

      // Create Date objects from the formatted strings to calculate length
      const newStart = new Date(newStartStr);
      const newEnd = new Date(newEndStr);
      const diffDays = differenceInDays(newEnd, newStart) + 1;

      // Directly insert the new cycle without checking for overlaps.
      const { data, error } = await supabase
        .from('cycles')
        .insert({
          user_id: user.id,
          start_date: newStartStr,
          end_date: newEndStr,
          length: diffDays,
        })
        .select();
      if (error) throw error;

      // Refresh local store after insertion.
      await get().fetchCycles();
    } catch (error: any) {
      console.error('Error adding cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Remove a cycle from Supabase.
  removeCycle: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('cycles').delete().eq('id', id);
      if (error) throw error;
      await get().fetchCycles();
    } catch (error: any) {
      console.error('Error removing cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Generate predictions on the fly using existing cycles (purely front-end)
  getPredictions: () => {
    const { cycles } = get();
    if (!cycles || cycles.length === 0) {
      return {
        message: 'Not enough data for predictions',
        predictions: null,
      };
    }
    // Format cycles for the prediction algorithm
    const periods = cycles.map((cycle) => ({
      start: format(new Date(cycle.startDate), 'yyyy-MM-dd'),
      end: format(new Date(cycle.endDate), 'yyyy-MM-dd'),
    }));
    return getCyclePredictions({ periods });
  },

  /**
   * ---------------
   *  Symptom Methods
   * ---------------
   */

  fetchSymptoms: async () => {
    set({ symptomLoading: true, symptomError: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;

      const formattedSymptoms = data.map((symptom: any) => ({
        id: symptom.id,
        user_id: symptom.user_id,
        date: new Date(symptom.date),
        symptoms: symptom.symptoms,
        intensity: 1,
        cycle_day: symptom.cycle_day,
        created_at: symptom.created_at,
      }));

      set({ symptoms: formattedSymptoms, symptomLoading: false });
    } catch (error: any) {
      console.error('Error fetching symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
    }
  },

  addSymptom: async (symptomData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      if (!symptomData.date) throw new Error('Symptom date is required');
      if (!symptomData.symptoms || symptomData.symptoms.length === 0) {
        throw new Error('At least one symptom is required');
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const formattedDate =
        typeof symptomData.date === 'string'
          ? symptomData.date
          : format(symptomData.date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
          user_id: user.id,
          date: formattedDate,
          symptoms: symptomData.symptoms,
          cycle_day: symptomData.cycle_day || null,
        })
        .select();
      if (error) throw error;

      const newSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1,
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at,
      };

      set((state) => ({
        symptoms: [...state.symptoms, newSymptom],
        symptomLoading: false,
      }));
      return newSymptom;
    } catch (error: any) {
      console.error('Error saving symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  removeSymptom: async (id) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      const { error } = await supabase.from('symptom_logs').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        symptoms: state.symptoms.filter((s) => s.id !== id),
        symptomLoading: false,
      }));
    } catch (error: any) {
      console.error('Error removing symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  updateSymptom: async (id, updateData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
      const dbUpdateData: any = {};
      if (updateData.date) {
        dbUpdateData.date =
          typeof updateData.date === 'string'
            ? updateData.date
            : format(updateData.date, 'yyyy-MM-dd');
      }
      if (updateData.symptoms) {
        dbUpdateData.symptoms = updateData.symptoms;
      }
      if ('cycle_day' in updateData) {
        dbUpdateData.cycle_day = updateData.cycle_day || null;
      }
      const { data, error } = await supabase
        .from('symptom_logs')
        .update(dbUpdateData)
        .eq('id', id)
        .select();
      if (error) throw error;

      const updatedSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1,
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at,
      };

      set((state) => ({
        symptoms: state.symptoms.map((s) => (s.id === id ? updatedSymptom : s)),
        symptomLoading: false,
      }));
      return updatedSymptom;
    } catch (error: any) {
      console.error('Error updating symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },
}));
