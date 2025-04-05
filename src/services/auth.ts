import { auth } from '../lib/api';
import { SignupData, AuthResponse } from '../types/auth';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await auth.login(email, password);
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        return { success: true, data: data.user };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to login' 
      };
    }
  },

  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const { data } = await auth.register(userData);
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        return { success: true, data: data.user };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to sign up' 
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await auth.logout();
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};