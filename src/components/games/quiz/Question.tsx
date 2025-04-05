import React from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from '../../../types/games';

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  timeRemaining: number;
}

export default function Question({ question, onAnswer, timeRemaining }: QuestionProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-primary">{question.question}</h3>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAnswer(option)}
            className="p-4 text-left rounded-xl bg-white hover:bg-primary/5 transition-colors border-2 border-primary/10 hover:border-primary"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}