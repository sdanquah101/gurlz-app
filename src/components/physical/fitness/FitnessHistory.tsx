// FitnessHistory.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, TrendingUp, Calendar } from 'lucide-react';
import Button from '../../common/Button';
import { FitnessAssessment } from '../../../types/fitness';

interface FitnessHistoryProps {
  assessments: FitnessAssessment[];
  onStartNewAssessment: () => void;
}

export default function FitnessHistory({
  assessments,
  onStartNewAssessment
}: FitnessHistoryProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Ready to start your assessment?</h3>
          <p className="text-gray-500 mt-1">Ensure that you answer the questions as truthfully as possible. This assessment will help you understand how fit you are now, and what you can do to improve</p>
        </div>
        <Button
          onClick={onStartNewAssessment}
          className="inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Take the Test
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
        <Button
          onClick={onStartNewAssessment}
          className="inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Assessment
        </Button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-500">
                  {new Date(assessment.completed_at).toLocaleDateString()}
                </span>
              </div>
              {index > 0 && (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    {Math.round(assessment.overall_score - assessments[index - 1].overall_score)}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-900">Overall Score:</span>
              <span className="text-xl font-bold text-primary">
                {Math.round(assessment.overall_score)}%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['cardiovascular', 'strength', 'endurance', 'flexibility', 'composition'].map(category => (
                <div key={category} className="text-sm">
                  <p className="text-gray-500 capitalize">{category}</p>
                  <p className="font-medium text-gray-900">
                    {Math.round(assessment[`${category}_score` as keyof FitnessAssessment] as number)}%
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}