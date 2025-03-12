import React from 'react';

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function GenderSelector({ value, onChange, disabled }: GenderSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`p-3 rounded-xl border-2 transition-all
            ${value === 'female'
              ? 'border-primary bg-primary/5'
              : 'border-primary/20 hover:border-primary'
            }`}
          disabled={disabled}
        >
          Female
        </button>
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`p-3 rounded-xl border-2 transition-all
            ${value === 'male'
              ? 'border-primary bg-primary/5'
              : 'border-primary/20 hover:border-primary'
            }`}
          disabled={disabled}
        >
          Male
        </button>
      </div>
    </div>
  );
}