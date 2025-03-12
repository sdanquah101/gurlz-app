import React from 'react';
import { Send } from 'lucide-react';
import Button from '../../common/Button';

interface GameControlsProps {
  guess: string;
  setGuess: (guess: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function GameControls({ guess, setGuess, onSubmit, disabled }: GameControlsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          disabled={disabled}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="Type your guess..."
        />
        <Button
          type="submit"
          disabled={disabled || !guess.trim()}
          className="px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}