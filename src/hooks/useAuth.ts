import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SignupData, AuthResponse } from '../types/auth';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: loginStore, logout: logoutStore } = useAuthStore();

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it using metadata from auth
        if (profileError.code === 'PGRST116') { // Resource not found error
          console.log("Profile not found, creating from auth metadata");
          
          // Get user metadata
          const metadata = data.user.user_metadata || {};
          
          // Create profile
          const newProfile = {
            id: data.user.id,
            email: data.user.email!,
            username: metadata.username || data.user.email!.split('@')[0],
            age_group: metadata.age_group || '19-25',
            gender: metadata.gender || null,
            country: metadata.country || null,
            phone_number: metadata.phone_number || null,
            user_type: metadata.user_type || 'individual'
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating profile on first login:", createError);
            throw new Error(`Failed to create profile: ${createError.message}`);
          }
          
          // Use created profile
          loginStore({
            id: data.user.id,
            email: data.user.email!,
            username: newProfile.username,
            gender: newProfile.gender,
            country: newProfile.country,
            phoneNumber: newProfile.phone_number || '',
            dateJoined: new Date(),
            type: newProfile.user_type
          });
          
          navigate('/dashboard');
          return { success: true, data: createdProfile };
        } else {
          throw profileError;
        }
      }

      // Profile exists, use it
      loginStore({
        id: data.user.id,
        email: data.user.email!,
        username: profile.username,
        gender: profile.gender,
        country: profile.country,
        phoneNumber: profile.phone_number || '',
        dateJoined: new Date(profile.created_at),
        type: profile.user_type
      });

      navigate('/dashboard');
      return { success: true, data: profile };
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: SignupData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!userData.email) throw new Error('Email is required');
      if (!userData.password) throw new Error('Password is required');
      if (!userData.username) throw new Error('Username is required');
      
      // Validate age group - must match one of the valid DB values
      const validAgeGroups = ['12-18', '19-25', '26-30', '31-35', '35+'];
      if (!userData.ageGroup || !validAgeGroups.includes(userData.ageGroup)) {
        throw new Error('Valid age group is required');
      }
      
      console.log("Signing up user:", userData.email);
      
      // Store all user data as metadata
      // This will be used to create the profile on first login after email verification
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          // Enable email confirmation
          emailRedirect: `${window.location.origin}/auth/callback`,
          data: {
            // Store all user data as metadata for profile creation later
            username: userData.username,
            gender: userData.gender,
            country: userData.country,
            phone_number: userData.phoneNumber,
            age_group: userData.ageGroup,
            user_type: userData.type || 'individual'
          }
        }
      });
    
      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }
      
      console.log("Auth user created successfully:", data.user.id);
      console.log("Profile will be created on first login after email verification");
      
      return { 
        success: true, 
        data: { id: data.user.id } 
      };
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      logoutStore();
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signIn,
    signUp,
    logout
  };
}