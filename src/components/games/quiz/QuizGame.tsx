import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { gameSocket } from '../../../services/gameSocket';
import { QuizGameState, QuizQuestion } from '../../../types/games';
import Question from './Question';
import QuizProgress from './QuizProgress';
import { motion } from 'framer-motion';

const QUIZ_DURATION = 30; // seconds per question

const sampleQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the most effective way to maintain elegance in challenging situations?',
    options: [
      'React emotionally',
      'Maintain composure and grace',
      'Ignore the situation',
      'Seek immediate confrontation'
    ],
    correctAnswer: 'Maintain composure and grace'
  },
  // Add more questions...
];

export default function QuizGame() {
  const { gameState } = useGameStore();
  const [quizState, setQuizState] = useState<QuizGameState>({
    currentQuestion: 0,
    questions: sampleQuestions,
    answers: {},
    score: 0,
    timeRemaining: QUIZ_DURATION
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setQuizState(prev => {
        if (prev.timeRemaining <= 0) {
          handleNextQuestion();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gameSocket.onGameMove((move) => {
      if (move.moveType === 'quiz') {
        // Handle opponent's answer
      }
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  const handleAnswer = (answer: string) => {
    const currentQ = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;

    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQ.id]: answer },
      score: isCorrect ? prev.score + 10 : prev.score
    }));

    gameSocket.makeMove({
      gameId: gameState?.gameType || '',
      playerId: 'current-player',
      moveType: 'quiz',
      value: answer,
      timestamp: new Date()
    });

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      timeRemaining: QUIZ_DURATION
    }));
  };

  const currentQuestion = quizState.questions[quizState.currentQuestion];

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Quiz Complete!</h2>
        <p className="text-lg text-gray-600">Your score: {quizState.score}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <QuizProgress
          currentQuestion={quizState.currentQuestion + 1}
          totalQuestions={quizState.questions.length}
          timeRemaining={quizState.timeRemaining}
          score={quizState.score}
        />

        <Question
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeRemaining={quizState.timeRemaining}
        />
      </motion.div>
    </div>
  );
}