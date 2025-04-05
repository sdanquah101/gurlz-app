import React from 'react';
import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onAnswer: (answerIndex: number) => void;
  category: string;
}

export default function QuizQuestion({
  question,
  options,
  selectedAnswer,
  onAnswer,
  category
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            aria-label={`${option} (${index + 1} of ${options.length})`}
          >
            <span className="flex items-center">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === index ? 'border-primary' : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-primary rounded-full"
                  />
                )}
              </span>
              <span>{option}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}