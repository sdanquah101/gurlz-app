import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  category: string;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  category
}: QuizProgressProps) {
  // Fix: Ensure progress calculation can't exceed 100%
  const progress = totalQuestions > 0 
    ? Math.min(100, Math.max(0, (currentQuestion / totalQuestions) * 100)) 
    : 0;

  return (
    <div className="space-y-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Quiz Progress: ${Math.round(progress)}%`}>
      {/* Progress Details */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            Question {currentQuestion} of {totalQuestions}
          </p>
          <p className="text-lg font-semibold text-primary">{category}</p>
        </div>
        <span className="text-2xl font-bold text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}