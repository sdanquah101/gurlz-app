import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Appointment {
  id: string;
  therapistId: string;
  date: string;
  time: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  cancelAppointment: (id: string) => void;
  getAppointments: (userId: string) => Appointment[];
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      
      addAppointment: (appointmentData) => set((state) => ({
        appointments: [...state.appointments, {
          ...appointmentData,
          id: Date.now().toString(),
          createdAt: new Date()
        }]
      })),
      
      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? { ...apt, status: 'cancelled' } : apt
        )
      })),
      
      getAppointments: (userId) => {
        return get().appointments.filter(apt => apt.userId === userId);
      }
    }),
    {
      name: 'appointment-storage'
    }
  )
);