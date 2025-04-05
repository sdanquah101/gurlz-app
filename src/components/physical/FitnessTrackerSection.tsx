import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp } from 'lucide-react';
import Button from '../common/Button';

export default function FitnessTrackerSection() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary flex items-center">
          <Activity className="mr-2" />
          Fitness Assessment
        </h3>
      </div>

      <div className="text-center py-8 space-y-4">
        <p className="text-gray-600">
          Take our comprehensive fitness assessment to understand your current fitness level
          and get personalized recommendations.
        </p>
        <Button onClick={() => navigate('/physical/fitness-assessment')}>
          <TrendingUp className="mr-2" size={20} />
          Start Assessment
        </Button>
      </div>
    </div>
  );
}