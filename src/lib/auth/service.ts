import { storage } from './storage';
import { mockUsers } from './mockUsers';
import { SignupData, AuthResponse } from '../../types/auth';

export const authService = {
  login: async (email: string, _password: string): Promise<AuthResponse> => {
    // Accept any credentials
    const user = mockUsers.findOrCreate(email);
    const token = 'mock-token-' + Date.now();
    
    storage.setToken(token);
    storage.setUser(user);
    
    return { success: true, data: user };
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const user = mockUsers.add({
      id: String(Date.now()),
      email: data.email,
      username: data.username,
      gender: data.gender,
      country: data.country,
      phoneNumber: data.phoneNumber || '',
      dateJoined: new Date()
    });
    
    const token = 'mock-token-' + Date.now();
    storage.setToken(token);
    storage.setUser(user);
    
    return { success: true, data: user };
  },

  logout: () => {
    storage.clear();
  },

  getProfile: async () => {
    const user = storage.getUser();
    return user ? { success: true, data: user } : { success: false };
  }
};