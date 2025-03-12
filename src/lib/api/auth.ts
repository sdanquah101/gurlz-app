import { mockAuth } from '../mockAuth';
import { SignupData } from '../../types/auth';

export const auth = {
  login: async (email: string, password: string) => {
    const response = await mockAuth.login(email, password);
    localStorage.setItem('auth_token', response.token);
    return { data: response };
  },
  
  register: async (data: SignupData) => {
    const response = await mockAuth.register(data);
    localStorage.setItem('auth_token', response.token);
    return { data: response };
  },
  
  logout: async () => {
    localStorage.removeItem('auth_token');
    return { data: { message: 'Logged out successfully' } };
  },
    
  getProfile: async () => {
    const user = await mockAuth.getProfile();
    return { data: user };
  }
};