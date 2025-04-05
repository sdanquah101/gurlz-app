import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import DailyActivityTracker from '../../components/physical/DailyActivityTracker';

export default function ExerciseTracking() {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold mb-2">Exercise Tracking</h1>
        <p className="text-secondary-light/90">Monitor your daily activities and workouts</p>
      </div>

      {/* Activity Tracker */}
      <DailyActivityTracker />
    </div>
  );
}