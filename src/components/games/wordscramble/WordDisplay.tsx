import React from 'react';
import { motion } from 'framer-motion';

interface WordDisplayProps {
  scrambledWord: string;
  timeRemaining: number;
  score: number;
}

export default function WordDisplay({ scrambledWord, timeRemaining, score }: WordDisplayProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="bg-primary/10 px-4 py-2 rounded-lg">
          <span className="text-primary font-semibold">Time: {timeRemaining}s</span>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-lg">
          <span className="text-primary font-semibold">Score: {score}</span>
        </div>
      </div>

      <motion.div
        key={scrambledWord}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-4xl font-bold tracking-wider text-primary"
      >
        {scrambledWord.split('').map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="inline-block mx-1"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}