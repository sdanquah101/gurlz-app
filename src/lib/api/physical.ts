import api from './client';

export const physical = {
  scheduleWorkout: (data: { date: string; type: string; duration: number }) =>
    api.post('/physical/workouts', data),
    
  getWorkoutSessions: () =>
    api.get('/physical/workouts'),
    
  createDietPlan: (data: { goal: string; preferences: string[]; restrictions: string[] }) =>
    api.post('/physical/diet-plans', data),
    
  getDietPlan: () =>
    api.get('/physical/diet-plans')
};