import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../../../types/physical';
import { formatDistanceToNow } from 'date-fns';

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'water': return '💧';
      case 'meal': return '🍽️';
      case 'walking': return '👣';
      case 'exercise': return '💪';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {activity.value} {activity.unit}
                  </h4>
                  {activity.notes && (
                    <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time || formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No activities logged today
        </div>
      )}
    </div>
  );
}