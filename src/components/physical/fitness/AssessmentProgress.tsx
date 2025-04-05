import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  category: string;
}

export default function AssessmentProgress({
  currentQuestion,
  totalQuestions,
  category
}: AssessmentProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity className="text-primary" size={24} />
          <span className="text-sm text-gray-500">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <span className="text-2xl font-bold text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}