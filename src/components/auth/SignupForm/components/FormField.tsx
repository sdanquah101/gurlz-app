import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export function FormField({ icon: Icon, ...props }: FormFieldProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}