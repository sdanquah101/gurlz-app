import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';

interface ExerciseSettings {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
}

interface ExerciseSettingsProps {
  settings: ExerciseSettings;
  onSettingsChange: (settings: ExerciseSettings) => void;
  onStart: () => void;
}

export default function ExerciseSettings({
  settings,
  onSettingsChange,
  onStart
}: ExerciseSettingsProps) {
  const handleChange = (key: keyof ExerciseSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inhale Duration (seconds)
          </label>
          <input
            type="number"
            value={settings.inhaleTime}
            onChange={(e) => handleChange('inhaleTime', parseInt(e.target.value))}
            min={2}
            max={10}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hold Duration (seconds)
          </label>
          <input
            type="number"
            value={settings.holdTime}
            onChange={(e) => handleChange('holdTime', parseInt(e.target.value))}
            min={0}
            max={10}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exhale Duration (seconds)
          </label>
          <input
            type="number"
            value={settings.exhaleTime}
            onChange={(e) => handleChange('exhaleTime', parseInt(e.target.value))}
            min={2}
            max={10}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Cycles
          </label>
          <input
            type="number"
            value={settings.cycles}
            onChange={(e) => handleChange('cycles', parseInt(e.target.value))}
            min={1}
            max={10}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Button onClick={onStart} className="w-full">
        Start Exercise
      </Button>
    </motion.div>
  );
}