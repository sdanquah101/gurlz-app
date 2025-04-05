import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Sun, Users, Coffee, Moon, DollarSign, Activity } from 'lucide-react';
import Button from '../../common/Button';

interface CategoryScore {
  category: string;
  score: number;
  recommendations: string[];
}

interface QuizResultsProps {
  scores: CategoryScore[];
  onRetake: () => void;
  onSave: () => void;
}

// Complete map of all category icons
const categoryIcons = {
  'Emotional Well-being': Heart,
  'Stress Management': Brain,
  'Social Connection': Users,
  'Self-care': Coffee,
  'Sleep Quality': Moon,
  'Life Satisfaction': Sun,
  'Physical Well-being': Activity,
  'Financial Well-being': DollarSign
};

export default function QuizResults({ scores, onRetake, onSave }: QuizResultsProps) {
  // Calculate overall score, with safety check for empty array
  const overallScore = scores.length 
    ? Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length) 
    : 0;

  console.log('Rendering results with scores:', scores);
  console.log('Overall score:', overallScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Overall Score */}
      <div className="text-center">
        <div className="inline-block p-8 rounded-full bg-primary/10">
          <div className="text-4xl font-bold text-primary">{overallScore}%</div>
          <div className="text-sm text-gray-600">Overall Well-being</div>
        </div>
      </div>

      {/* Category Scores */}
      {scores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scores.map((score, index) => {
            // Get icon or use Brain as fallback
            const Icon = categoryIcons[score.category as keyof typeof categoryIcons] || Brain;

            return (
              <motion.div
                key={score.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg" aria-label={score.category}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{score.category}</h3>
                    <p className="text-sm text-gray-500">{score.score}% Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {score.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No scores available to display.</p>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onRetake}>
          Retake Quiz
        </Button>
        <Button onClick={onSave}>
          Save Results
        </Button>
      </div>
    </motion.div>
  );
}