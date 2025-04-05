import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (data: any) => 
    api.post('/auth/register', data),
  
  logout: () => 
    api.post('/auth/logout')
};

// Chat endpoints
export const chat = {
  getRooms: () => 
    api.get('/chat/rooms'),
  
  getMessages: (roomId: string) => 
    api.get(`/chat/rooms/${roomId}/messages`),
  
  sendMessage: (roomId: string, content: string, isAnonymous: boolean = false) =>
    api.post('/chat/messages', { roomId, content, isAnonymous })
};

// Health endpoints
export const health = {
  getCycles: () => 
    api.get('/health/cycles'),
  
  addCycle: (data: any) =>
    api.post('/health/cycles', data),
  
  getPrediction: () =>
    api.get('/health/prediction')
};

export default api;