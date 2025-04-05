import React from 'react';
import { motion } from 'framer-motion';
import { FitnessQuestion } from '../../../types/fitness';

interface AssessmentQuestionProps {
  question: FitnessQuestion;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

export default function AssessmentQuestion({ 
  question, 
  selectedAnswer, 
  onAnswer 
}: AssessmentQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 px-4 py-2 rounded-lg">
        <span className="text-sm font-medium text-primary capitalize">
          {question.category}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900">{question.question}</h3>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAnswer(option)}
            className={`w-full p-4 text-left rounded-xl transition-colors
              ${selectedAnswer === option
                ? 'bg-primary text-white'
                : 'bg-secondary/10 hover:bg-secondary/20'
              }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}