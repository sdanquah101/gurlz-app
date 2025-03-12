import api from './client';
import { Cycle } from '../../types/health';

export const health = {
  getCycles: () => 
    api.get<Cycle[]>('/health/cycles'),
  
  addCycle: (data: Omit<Cycle, 'id'>) =>
    api.post('/health/cycles', data),
  
  getPrediction: () =>
    api.get('/health/prediction'),
    
  updateCycleDay: (date: string, data: any) =>
    api.patch(`/health/cycles/days/${date}`, data)
};