import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../common/Button';
import QuizQuestion from './QuizQuestion';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import { quizQuestions } from './questions';

export default function WellnessQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Improved handleAnswer function with proper logging and type handling
  const handleAnswer = (answerIndex: number) => {
    // Log current status
    console.log(`Storing answer for question ${currentQuestion}: ${answerIndex}`);
    
    // Ensure we're using a numeric type for the answer
    const numericAnswerIndex = Number(answerIndex);
    
    // Update answers state
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [currentQuestion]: numericAnswerIndex,
      };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Log final answers before showing results
      console.log('All questions answered, showing results...');
      setShowResults(true);
    }
  };

  // Fixed calculateScores function
  const calculateScores = () => {
    // Debug logging
    console.log("Calculating scores with answers:", answers);
    console.log("Answer keys:", Object.keys(answers));
    
    // Get unique categories
    const categories = Array.from(new Set(quizQuestions.map((q) => q.category)));
    
    return categories.map((category) => {
      console.log(`Processing category: ${category}`);
      
      // Get questions for this category
      const categoryQuestions = quizQuestions.filter((q) => q.category === category);
      
      let totalPoints = 0;
      let answeredQuestions = 0;
      
      // Loop through all questions to maintain consistent indexing
      for (let i = 0; i < quizQuestions.length; i++) {
        const question = quizQuestions[i];
        
        if (question.category === category) {
          // Check for the answer using both number and string key formats
          const answerValue = answers[i];
          
          if (answerValue !== undefined) {
            // Convert to number explicitly in case it's stored as string
            const answerIndex = Number(answerValue);
            
            // Invert the scale: first option (0) should be worth most points (100)
            // In the quiz, lower index = better wellness
            const invertedValue = 4 - answerIndex;
            const points = invertedValue * 25;
            
            totalPoints += points;
            answeredQuestions++;
            
            console.log(`Question ${i}: answer=${answerValue}, inverted=${invertedValue}, points=${points}`);
          }
        }
      }
      
      let score = 0;
      if (answeredQuestions > 0) {
        // Calculate percentage based on actual questions answered
        score = Math.round((totalPoints / (answeredQuestions * 100)) * 100);
        console.log(`${category}: score=${score}% (${totalPoints}/${answeredQuestions * 100})`);
      } else {
        console.log(`${category}: No questions answered - score=0%`);
      }
      
      return {
        category,
        score,
        recommendations: getRecommendations(category, score),
      };
    });
  };

  const getRecommendations = (category: string, score: number) => {
    if (score < 50) {
      return [
        'Consider seeking professional support.',
        'Focus on building daily self-care habits.',
        'Start with small, achievable goals.',
      ];
    } else if (score < 75) {
      return [
        'Continue your current practices.',
        'Try incorporating new wellness activities.',
        'Share your progress with others.',
      ];
    } else {
      return [
        'Maintain your excellent habits.',
        'Consider mentoring others.',
        'Challenge yourself with new goals.',
      ];
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleSave = () => {
    // Save results logic here
    navigate('/mental');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Wellness Quiz</h1>
        <p className="text-secondary-light/90">Evaluate your mental well-being</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <QuizProgress
                currentQuestion={currentQuestion + 1}
                totalQuestions={quizQuestions.length}
                category={quizQuestions[currentQuestion].category}
              />

              <QuizQuestion
                question={quizQuestions[currentQuestion].question}
                options={quizQuestions[currentQuestion].options}
                selectedAnswer={answers[currentQuestion] || null}
                onAnswer={handleAnswer}
                category={quizQuestions[currentQuestion].category}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Calculate scores ONCE using an IIFE and pass result to component */}
              {(() => {
                console.log('Preparing final results screen');
                const finalScores = calculateScores();
                console.log('Final calculated scores:', finalScores);
                return (
                  <QuizResults
                    scores={finalScores}
                    onRetake={handleRetake}
                    onSave={handleSave}
                  />
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}