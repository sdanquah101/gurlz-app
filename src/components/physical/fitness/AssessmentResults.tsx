
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Dumbbell, Timer, StretchHorizontal, Scale } from 'lucide-react';
import Button from '../../common/Button';
import { FitnessRecommendation } from '../../../types/fitness';

interface AssessmentResultsProps {
  scores: Record<string, number>;
  recommendations: FitnessRecommendation[];
  onRetake: () => void;
  onSave: () => void;
}

const categoryIcons = {
  cardiovascular: Activity,
  strength: Dumbbell,
  endurance: Timer,
  flexibility: StretchHorizontal,
  composition: Scale
};

export default function AssessmentResults({ 
  scores, 
  recommendations, 
  onRetake, 
  onSave 
}: AssessmentResultsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Your Results</h2>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(scores).map(([category, score]) => {
          if (category === 'overall') return null;
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
              </div>
              
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className="absolute h-full bg-primary"
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm font-medium text-primary">{Math.round(score)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Score */}
      <div className="bg-primary/10 p-6 rounded-xl text-center">
        <h3 className="text-lg font-semibold text-primary mb-2">Overall Fitness Score</h3>
        <p className="text-3xl font-bold text-primary">
          {Math.round(scores.overall)}%
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Recommendations</h3>
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              rec.priority === 'high' 
                ? 'bg-red-50 text-red-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>•</span>
              <p>{rec.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onRetake}>
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}