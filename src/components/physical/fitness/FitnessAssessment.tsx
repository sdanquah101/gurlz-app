import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../common/Button';
import AssessmentQuestion from './AssessmentQuestion';
import AssessmentProgress from './AssessmentProgress';
import AssessmentResults from './AssessmentResults';
import FitnessHistory from './FitnessHistory';
import { useFitnessAssessment } from '../../../hooks/useFitnessAssessment';
import { fitnessQuestions } from '../../../utils/fitnessQuestions';
import { calculateFitnessScore, getRecommendations } from '../../../utils/fitnessScoring';

export default function FitnessAssessment() {
  const navigate = useNavigate();
  const { getProgress, submitAssessment } = useFitnessAssessment();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const progressData = await getProgress();
    setProgress(progressData);
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [fitnessQuestions[currentQuestion].id]: answer
    }));

    if (currentQuestion < fitnessQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSaveResults = async () => {
    const scores = calculateFitnessScore(answers);
    const result = await submitAssessment(Object.entries(answers).map(([id, answer]) => ({
      questionId: id,
      answer,
      score: 0 // Score will be calculated on the server
    })));

    if (result) {
      await loadHistory();
      setIsAssessing(false);
      navigate('/physical', { 
        state: { message: 'Assessment completed successfully!' }
      });
    }
  };

  const startNewAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setIsAssessing(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/physical')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Physical
        </Button>
        <h1 className="text-3xl font-bold mb-2">Fitness Assessment</h1>
        <p className="text-secondary-light/90">Track your fitness journey</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!isAssessing ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FitnessHistory
                assessments={assessments}
                progress={progress}
                onStartNewAssessment={startNewAssessment}
              />
            </motion.div>
          ) : !showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <AssessmentProgress
                currentQuestion={currentQuestion + 1}
                totalQuestions={fitnessQuestions.length}
                category={fitnessQuestions[currentQuestion].category}
              />

              <AssessmentQuestion
                question={fitnessQuestions[currentQuestion]}
                selectedAnswer={answers[fitnessQuestions[currentQuestion].id] || null}
                onAnswer={handleAnswer}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AssessmentResults
                scores={calculateFitnessScore(answers)}
                recommendations={getRecommendations(calculateFitnessScore(answers))}
                onRetake={() => {
                  setAnswers({});
                  setCurrentQuestion(0);
                  setShowResults(false);
                }}
                onSave={handleSaveResults}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}