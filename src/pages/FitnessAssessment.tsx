import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import { fitnessQuestions } from '../utils/fitnessQuestions';
import { calculateFitnessScore, getRecommendations } from '../utils/fitnessScoring';

export default function FitnessAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

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

  const renderResults = () => {
    const scores = calculateFitnessScore(answers);
    const recommendations = getRecommendations(scores);

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-primary">Your Fitness Assessment Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(scores).map(([category, score]) => (
            <div key={category} className="bg-secondary/10 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary capitalize mb-4">
                {category} Score
              </h3>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1 }}
                  className="absolute inset-y-0 left-0 bg-primary"
                />
              </div>
              <div className="mt-2 text-right font-medium text-primary">
                {Math.round(score)}%
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  rec.priority === 'high' 
                    ? 'bg-red-50 text-red-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>{rec.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/physical')}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Physical
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Fitness Assessment</h1>
        <p className="text-secondary-light/90">
          Understand your current fitness level
        </p>
      </div>

      {/* Assessment Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <Activity className="text-primary" size={24} />
                  <span className="text-gray-500">
                    Question {currentQuestion + 1} of {fitnessQuestions.length}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-primary">
                  {fitnessQuestions[currentQuestion].text}
                </h2>

                <div className="space-y-4">
                  {fitnessQuestions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 text-left rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {renderResults()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}