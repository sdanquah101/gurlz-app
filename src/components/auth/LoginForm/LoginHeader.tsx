import React from 'react';
import { Heart } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <Heart className="inline-block text-primary-dark w-12 h-12 mb-2" />
      <h1 className="text-4xl font-bold text-primary-dark mb-2">Gurlz</h1>
      <p className="text-lg text-primary">Welcome back, beautiful!</p>
    </div>
  );
}