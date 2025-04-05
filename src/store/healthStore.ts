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
<<<<<<< HEAD
=======
  isPredicted?: boolean;    // New flag to indicate predicted cycles
>>>>>>> master
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
<<<<<<< HEAD
  
=======

>>>>>>> master
  // Symptom-related state
  symptoms: SymptomData[];
  symptomLoading: boolean;
  symptomError: string | null;
<<<<<<< HEAD
  
=======

>>>>>>> master
  // Cycle methods
  fetchCycles: () => Promise<void>;
  addCycle: (cycle: { startDate: Date, endDate: Date }) => Promise<void>;
  removeCycle: (id: string) => Promise<void>;
  getPredictions: () => any;
<<<<<<< HEAD
  
=======

>>>>>>> master
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
<<<<<<< HEAD
  
=======

>>>>>>> master
  // Initial symptom state
  symptoms: [],
  symptomLoading: false,
  symptomError: null,
<<<<<<< HEAD
  
  // Cycle methods (existing)
=======

  // Cycle methods
>>>>>>> master
  fetchCycles: async () => {
    set({ loading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
<<<<<<< HEAD
      
      if (!user) {
        throw new Error('User not authenticated');
      }

=======
      if (!user) {
        throw new Error('User not authenticated');
      }
>>>>>>> master
      // Fetch cycles from Supabase
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });
<<<<<<< HEAD

      if (error) throw error;

      // Convert string dates to Date objects and map snake_case to camelCase for frontend
=======
      if (error) throw error;
      // Convert string dates to Date objects and map snake_case to camelCase,
      // including the is_predicted flag.
>>>>>>> master
      const formattedCycles = data.map(cycle => ({
        id: cycle.id,
        user_id: cycle.user_id,
        startDate: new Date(cycle.start_date),
        endDate: new Date(cycle.end_date),
        length: cycle.length,
<<<<<<< HEAD
        created_at: cycle.created_at
      }));

      set({ cycles: formattedCycles, loading: false });
    } catch (error) {
=======
        created_at: cycle.created_at,
        isPredicted: cycle.is_predicted // may be undefined for actual logs
      }));
      set({ cycles: formattedCycles, loading: false });
    } catch (error: any) {
>>>>>>> master
      console.error('Error fetching cycles:', error);
      set({ error: error.message, loading: false });
    }
  },

  addCycle: async ({ startDate, endDate }) => {
    set({ loading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
<<<<<<< HEAD
      
=======
>>>>>>> master
      if (!user) {
        throw new Error('User not authenticated');
      }

<<<<<<< HEAD
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
=======
      // Normalize dates by stripping out time components
      const normalize = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const newStart = normalize(startDate);
      const newEnd = normalize(endDate);
      const newStartTime = newStart.getTime();
      const newEndTime = newEnd.getTime();

      const { cycles } = get();

      // Check for overlaps with actual logged cycles only (ignore predicted cycles)
      const overlappingActual = cycles.find((cycle) => {
        if (cycle.isPredicted) return false;
        const cycleStart = normalize(new Date(cycle.startDate)).getTime();
        const cycleEnd = normalize(new Date(cycle.endDate)).getTime();
        // Two periods do not overlap if newEnd < cycleStart OR newStart > cycleEnd.
        // They overlap if NOT (newEnd < cycleStart OR newStart > cycleEnd).
        return !(newEndTime < cycleStart || newStartTime > cycleEnd);
      });
      if (overlappingActual) {
        throw new Error('The selected date range overlaps with an existing period.');
      }

      // Remove any overlapping predicted cycles.
      const overlappingPredicted = cycles.filter((cycle) => {
        if (!cycle.isPredicted) return false;
        const cycleStart = normalize(new Date(cycle.startDate)).getTime();
        const cycleEnd = normalize(new Date(cycle.endDate)).getTime();
        return !(newEndTime < cycleStart || newStartTime > cycleEnd);
      });
      for (const predicted of overlappingPredicted) {
        await get().removeCycle(predicted.id!);
      }

      // Calculate length based on normalized dates: difference in days plus 1 (inclusive)
      const diffDays = differenceInDays(newEnd, newStart) + 1;

      // Insert new cycle into Supabase.
>>>>>>> master
      const { data, error } = await supabase
        .from('cycles')
        .insert({
          user_id: user.id,
<<<<<<< HEAD
          start_date: startDate.toISOString(), // snake_case for database
          end_date: endDate.toISOString(),     // snake_case for database
          length: diffDays,
        })
        .select();

      if (error) throw error;

      // Refresh cycles
      await get().fetchCycles();
    } catch (error) {
=======
          start_date: newStart.toISOString(),
          end_date: newEnd.toISOString(),
          length: diffDays,
          is_predicted: false // mark as an actual logged period
        })
        .select();
      if (error) throw error;

      // Refresh cycles after insertion.
      await get().fetchCycles();
    } catch (error: any) {
>>>>>>> master
      console.error('Error adding cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  removeCycle: async (id) => {
    set({ loading: true, error: null });
    try {
<<<<<<< HEAD
      // Delete cycle
=======
>>>>>>> master
      const { error } = await supabase
        .from('cycles')
        .delete()
        .eq('id', id);
<<<<<<< HEAD

      if (error) throw error;

      // Refresh cycles
      await get().fetchCycles();
    } catch (error) {
=======
      if (error) throw error;
      await get().fetchCycles();
    } catch (error: any) {
>>>>>>> master
      console.error('Error removing cycle:', error);
      set({ error: error.message, loading: false });
    }
  },

  getPredictions: () => {
    const { cycles } = get();
<<<<<<< HEAD
    
    // Only generate predictions if there's at least one logged cycle
    if (!cycles || cycles.length === 0) {
      return { 
        message: "Not enough data for predictions", 
        predictions: null 
      };
    }
    
    // Format cycles for the prediction algorithm
=======
    if (!cycles || cycles.length === 0) {
      return {
        message: "Not enough data for predictions",
        predictions: null
      };
    }
    // Format cycles for the prediction algorithm.
>>>>>>> master
    const periods = cycles.map((cycle) => ({
      start: new Date(cycle.startDate).toISOString().split('T')[0],
      end: new Date(cycle.endDate).toISOString().split('T')[0],
    }));
<<<<<<< HEAD
    
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
=======
    return getCyclePredictions({ periods });
  },

  // Symptom methods
  fetchSymptoms: async () => {
    set({ symptomLoading: true, symptomError: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
>>>>>>> master
      const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
<<<<<<< HEAD

      if (error) throw error;

      // Format symptom data for frontend
=======
      if (error) throw error;
>>>>>>> master
      const formattedSymptoms = data.map(symptom => ({
        id: symptom.id,
        user_id: symptom.user_id,
        date: new Date(symptom.date),
        symptoms: symptom.symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: symptom.cycle_day,
        created_at: symptom.created_at
      }));
<<<<<<< HEAD

      set({ symptoms: formattedSymptoms, symptomLoading: false });
    } catch (error) {
=======
      set({ symptoms: formattedSymptoms, symptomLoading: false });
    } catch (error: any) {
>>>>>>> master
      console.error('Error fetching symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
    }
  },

  addSymptom: async (symptomData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
<<<<<<< HEAD
      // Input validation
=======
>>>>>>> master
      if (!symptomData.date) throw new Error('Symptom date is required');
      if (!symptomData.symptoms || symptomData.symptoms.length === 0) {
        throw new Error('At least one symptom is required');
      }
<<<<<<< HEAD

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
=======
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      const formattedDate = typeof symptomData.date === 'string'
        ? symptomData.date
        : symptomData.date.toISOString().split('T')[0];
>>>>>>> master
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
          user_id: user.id,
          date: formattedDate,
          symptoms: symptomData.symptoms,
          cycle_day: symptomData.cycle_day || null
        })
        .select();
<<<<<<< HEAD

      if (error) throw error;

      // Format the returned data
=======
      if (error) throw error;
>>>>>>> master
      const newSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at
      };
<<<<<<< HEAD

      // Update local state
=======
>>>>>>> master
      set(state => ({
        symptoms: [...state.symptoms, newSymptom],
        symptomLoading: false
      }));
<<<<<<< HEAD

      return newSymptom;
    } catch (error) {
=======
      return newSymptom;
    } catch (error: any) {
>>>>>>> master
      console.error('Error saving symptoms:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  removeSymptom: async (id) => {
    set({ symptomLoading: true, symptomError: null });
    try {
<<<<<<< HEAD
      // Delete symptom from symptom_logs table
=======
>>>>>>> master
      const { error } = await supabase
        .from('symptom_logs')
        .delete()
        .eq('id', id);
<<<<<<< HEAD

      if (error) throw error;

      // Update local state
=======
      if (error) throw error;
>>>>>>> master
      set(state => ({
        symptoms: state.symptoms.filter(s => s.id !== id),
        symptomLoading: false
      }));
<<<<<<< HEAD
    } catch (error) {
=======
    } catch (error: any) {
>>>>>>> master
      console.error('Error removing symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  },

  updateSymptom: async (id, updateData) => {
    set({ symptomLoading: true, symptomError: null });
    try {
<<<<<<< HEAD
      // Format data for database
      const dbUpdateData: any = {};
      
=======
      const dbUpdateData: any = {};
>>>>>>> master
      if (updateData.date) {
        dbUpdateData.date = typeof updateData.date === 'string'
          ? updateData.date
          : updateData.date.toISOString().split('T')[0];
      }
<<<<<<< HEAD
      
      if (updateData.symptoms) dbUpdateData.symptoms = updateData.symptoms;
      if ('cycle_day' in updateData) dbUpdateData.cycle_day = updateData.cycle_day || null;

      // Update symptom in symptom_logs table
=======
      if (updateData.symptoms) dbUpdateData.symptoms = updateData.symptoms;
      if ('cycle_day' in updateData) dbUpdateData.cycle_day = updateData.cycle_day || null;
>>>>>>> master
      const { data, error } = await supabase
        .from('symptom_logs')
        .update(dbUpdateData)
        .eq('id', id)
        .select();
<<<<<<< HEAD

      if (error) throw error;

      // Format the returned data
=======
      if (error) throw error;
>>>>>>> master
      const updatedSymptom = {
        id: data[0].id,
        user_id: data[0].user_id,
        date: new Date(data[0].date),
        symptoms: data[0].symptoms,
        intensity: 1, // Hardcoded as we removed intensity UI
        cycle_day: data[0].cycle_day,
        created_at: data[0].created_at
      };
<<<<<<< HEAD

      // Update local state
=======
>>>>>>> master
      set(state => ({
        symptoms: state.symptoms.map(s => s.id === id ? updatedSymptom : s),
        symptomLoading: false
      }));
<<<<<<< HEAD

      return updatedSymptom;
    } catch (error) {
=======
      return updatedSymptom;
    } catch (error: any) {
>>>>>>> master
      console.error('Error updating symptom:', error);
      set({ symptomError: error.message, symptomLoading: false });
      throw error;
    }
  }
<<<<<<< HEAD
}));
=======
}));
>>>>>>> master
