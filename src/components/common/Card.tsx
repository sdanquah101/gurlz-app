import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>
      {children}
    </div>
  );
}