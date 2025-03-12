import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../common/Button';

interface ActivityFormProps {
  onSubmit: (activity: {
    type: string;
    value: number;
    unit: string;
    time?: string;
    notes?: string;
  }) => void;
}

export default function ActivityForm({ onSubmit }: ActivityFormProps) {
  const [type, setType] = React.useState('');
  const [value, setValue] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [time, setTime] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !value || !unit) return;

    onSubmit({
      type,
      value: Number(value),
      unit,
      time,
      notes: notes.trim() || undefined
    });

    // Reset form
    setType('');
    setValue('');
    setUnit('');
    setTime('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="">Select Type</option>
            <option value="water">Water Intake</option>
            <option value="meal">Meal</option>
            <option value="walking">Walking</option>
            <option value="exercise">Exercise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="">Select Unit</option>
            {type === 'water' && <option value="glasses">Glasses</option>}
            {type === 'meal' && <option value="calories">Calories</option>}
            {type === 'walking' && (
              <>
                <option value="steps">Steps</option>
                <option value="km">Kilometers</option>
              </>
            )}
            {type === 'exercise' && <option value="minutes">Minutes</option>}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          rows={2}
          placeholder={type === 'meal' ? 'What did you eat?' : 'Add notes...'}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus size={20} className="mr-2" />
        Add Activity
      </Button>
    </form>
  );
}