import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { fitnessQuestions } from '../../utils/fitnessQuestions';
import { calculateFitnessScore, getRecommendations } from '../../utils/fitnessScoring';

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

  const scores = calculateFitnessScore(answers);
  const recommendations = getRecommendations(scores);

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
        <p className="text-secondary-light/90">Evaluate your current fitness level</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {fitnessQuestions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round((currentQuestion / fitnessQuestions.length) * 100)}%
                </span>
              </div>

              {/* Question */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {fitnessQuestions[currentQuestion].text}
                </h3>

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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Results */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-primary">Your Results</h2>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(scores).map(([category, score]) => (
                    <div key={category} className="bg-secondary/10 p-4 rounded-xl">
                      <h3 className="font-medium text-gray-900 capitalize mb-2">
                        {category} Score
                      </h3>
                      <div className="relative h-2 bg-gray-200 rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          className="absolute h-full bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-right mt-1 text-sm font-medium text-primary">
                        {Math.round(score)}%
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Recommendations</h3>
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        rec.priority === 'high' 
                          ? 'bg-red-50 text-red-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      <p>{rec.text}</p>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate('/physical')} className="w-full">
                  Back to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}