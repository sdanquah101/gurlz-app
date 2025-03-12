import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

export default function Input({ 
  icon: Icon,
  error,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
        )}
        <input
          className={`
            w-full 
            ${Icon ? 'pl-10' : 'pl-4'} 
            pr-4 
            py-3 
            border-2 
            border-secondary/50 
            rounded-xl 
            focus:ring-2 
            focus:ring-primary 
            focus:border-transparent 
            transition-all
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}