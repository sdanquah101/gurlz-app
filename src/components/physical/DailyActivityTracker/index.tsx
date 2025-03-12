import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../../../types/physical';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';

export default function DailyActivityTracker() {
  const [activities, setActivities] = React.useState<Activity[]>([]);

  const handleAddActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Daily Activity Tracker</h2>
      
      <div className="space-y-6">
        <ActivityForm onSubmit={handleAddActivity} />
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}