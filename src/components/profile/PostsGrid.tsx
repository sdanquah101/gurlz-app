import React from 'react';
import { motion } from 'framer-motion';
import { FashionPost } from '../../types/fashion';
import { Heart, MessageCircle } from 'lucide-react';

interface PostsGridProps {
  posts: FashionPost[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square group cursor-pointer"
        >
          <img
            src={post.images[0]}
            alt={post.description}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-1" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}