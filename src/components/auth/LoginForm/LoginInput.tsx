import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export default function LoginInput({ icon: Icon, ...props }: LoginInputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
      <input
        className="w-full pl-10 pr-4 py-3 border-2 border-secondary/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        {...props}
      />
    </div>
  );
}