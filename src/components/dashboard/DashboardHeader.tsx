import React from 'react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-dark text-white p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Gurlz, {user?.username}!
          </h1>
          <p className="text-lg text-secondary-light/90">
            Your safe space for growth, connection, and empowerment.
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img
            src="https://img.freepik.com/free-photo/medium-shot-african-women-posing-together_23-2151463158.jpg"
            alt="Happy Girls"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}