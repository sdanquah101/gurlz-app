import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../../common/Button';

interface ExerciseControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  completedCycles: number;
  totalCycles: number;
}

export default function ExerciseControls({
  isActive,
  onToggle,
  onReset,
  completedCycles,
  totalCycles
}: ExerciseControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <Button onClick={onToggle} size="lg">
          {isActive ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
        <Button onClick={onReset} variant="outline" size="lg">
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Cycle {completedCycles} of {totalCycles}
        </p>
      </div>
    </div>
  );
}