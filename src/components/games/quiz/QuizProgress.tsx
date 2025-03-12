import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  score: number;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  score
}: QuizProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Question</p>
          <p className="text-xl font-bold text-primary">
            {currentQuestion} / {totalQuestions}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-xl font-bold text-primary">{score}</p>
        </div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${(timeRemaining / 30) * 100}%` }}
          className="absolute top-0 left-0 h-full bg-primary"
        />
      </div>
    </div>
  );
}