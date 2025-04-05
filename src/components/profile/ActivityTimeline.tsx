import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, ShoppingBag, Bookmark, Image } from 'lucide-react';
import { UserActivity } from '../../types/profile';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: UserActivity[];
}

const activityIcons = {
  post: { icon: Image, color: 'text-blue-500 bg-blue-50' },
  like: { icon: Heart, color: 'text-red-500 bg-red-50' },
  chat: { icon: MessageCircle, color: 'text-green-500 bg-green-50' },
  purchase: { icon: ShoppingBag, color: 'text-purple-500 bg-purple-50' },
  save: { icon: Bookmark, color: 'text-yellow-500 bg-yellow-50' },
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  useEffect(() => {
    console.log('ActivityTimeline received activities:', activities);
  }, [activities]);

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {Array.isArray(activities) ? 'No activity yet' : 'Loading activities...'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        if (!activity || !activity.type || !activityIcons[activity.type]) {
          console.warn('Skipping invalid activity:', activity);
          return null;
        }

        const { icon: Icon, color } = activityIcons[activity.type];

        // Ensure we have a valid timestamp
        let timestamp: Date;
        try {
          timestamp = activity.timestamp instanceof Date ? activity.timestamp : new Date(activity.timestamp);
          if (isNaN(timestamp.getTime())) throw new Error('Invalid timestamp');
        } catch (error) {
          console.error('Invalid timestamp for activity:', activity);
          timestamp = new Date(); // Fallback to current time
        }

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">{activity.content || 'No content provided'}</p>
              <p className="text-sm text-gray-500">{formatDistanceToNow(timestamp, { addSuffix: true })}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
