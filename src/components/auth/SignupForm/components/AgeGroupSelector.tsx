import React from 'react';
import { AgeGroup } from '../../../../types/auth';

interface AgeGroupSelectorProps {
  value: AgeGroup;
  onChange: (value: AgeGroup) => void;
  disabled?: boolean;
}

export default function AgeGroupSelector({ value, onChange, disabled }: AgeGroupSelectorProps) {
  const ageGroups: AgeGroup[] = ['12-18', '19-25', '26-30', '31-35', '35+'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ageGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => onChange(group)}
            disabled={disabled}
            className={`p-3 rounded-xl text-sm transition-all
              ${value === group
                ? 'bg-primary text-white'
                : 'bg-secondary/10 hover:bg-secondary/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
}