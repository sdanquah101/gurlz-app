import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryCard from './StoryCard';

interface Story {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  isAnonymous: boolean;
  likes: number;
  comments: any[];
  views: number;
  color: string;
  liked?: boolean;
}

interface StoryFeedProps {
  stories: Story[];
  onStoryClick: (id: string) => void;
  onLike: (id: string) => void;
}

const colors = [
  'bg-purple-50',
  'bg-orange-50',
  'bg-yellow-50',
  'bg-pink-50',
  'bg-blue-50',
  'bg-green-50'
];

export default function StoryFeed({ stories, onStoryClick, onLike }: StoryFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <StoryCard
              content={story.content}
              author={story.isAnonymous ? 'Anonymous' : story.author.username}
              likes={story.likes}
              comments={story.comments.length}
              views={story.views}
              color={colors[index % colors.length]}
              onLike={() => onLike(story.id)}
              onClick={() => onStoryClick(story.id)}
              liked={story.liked}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}