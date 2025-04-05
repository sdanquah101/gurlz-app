import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { AgeGroup } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  fetchUserFromSupabase: (userId: string) => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (user) => {
        console.log('Logging in user:', user);
        set({ user, isAuthenticated: true, error: null, loading: false });
      },

      logout: async () => {
        console.log('Logging out user.');
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          localStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false, error: null, loading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: 'Failed to logout', loading: false });
        }
      },

      updateProfile: (updates) => {
        console.log('Updating profile:', updates);
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      fetchUserFromSupabase: async (userId) => {
        console.log('Fetching user data for userId:', userId);
        
        if (!userId) {
          console.error('No userId provided to fetchUserFromSupabase');
          return null;
        }

        set({ loading: true });

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              id,
              email,
              username,
              gender,
              country,
              phone_number,
              age_group,
              profile_image_url,
              bio
            `)
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Supabase query error:', error);
            set({ error: error.message, loading: false });
            return null;
          }

          if (!data) {
            console.warn('No user data found for userId:', userId);
            set({ error: 'User not found', loading: false });
            return null;
          }

          const userData: User = {
            id: data.id,
            email: data.email,
            username: data.username,
            gender: data.gender,
            country: data.country,
            phoneNumber: data.phone_number,
            ageGroup: data.age_group as AgeGroup,
            profileImage: data.profile_image_url,
            bio: data.bio
          };

          // Only update the store's user if it's the currently logged-in user
          const currentUser = get().user;
          if (currentUser && currentUser.id === userId) {
            set({ user: userData, isAuthenticated: true, error: null, loading: false });
          } else {
            set({ loading: false, error: null });
          }

          console.log('Successfully fetched user data:', userData);
          return userData;

        } catch (error) {
          console.error('Error during fetchUserFromSupabase:', error);
          set({ error: 'Failed to fetch user data', loading: false });
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);