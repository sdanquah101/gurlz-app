import React, { useState } from 'react';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../common/Button';
import { ChatMessage } from '../../../types/chat';

interface SingleChatViewProps {
  chat: ChatMessage;
  onBack: () => void;
}

export default function SingleChatView({ chat, onBack }: SingleChatViewProps) {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Comment card colors - exactly as shown in the image
  const commentColors = [
    'bg-green-100',
    'bg-yellow-100',
    'bg-green-100'  // Alternating pattern from image
  ];

  return (
    <div className="space-y-6">
      {/* Story Section */}
      <div className="bg-purple-100 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Story</h2>
        
        <div className="space-y-4">
          <p className="text-gray-800 text-lg">{chat.content}</p>
          <p className="text-gray-600">- {chat.isAnonymous ? 'Anonymous' : chat.author.username}</p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Heart className={`w-5 h-5 ${chat.liked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
              <span className="text-gray-700">{chat.likes}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{chat.comments.length} Comments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{chat.viewCount} Views</span>
            </div>
          </div>

          <Button 
            onClick={onBack} 
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Back to Chatroom
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Comments</h2>
        
        <div className="space-y-4">
          {chat.comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${commentColors[index % commentColors.length]} p-4 rounded-xl`}
            >
              <p className="text-gray-800 mb-2">{comment.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">- {comment.isAnonymous ? 'Anonymous' : comment.author.username}</p>
                <div className="flex items-center space-x-2">
                  <Heart 
                    className={`w-4 h-4 ${comment.liked ? 'text-red-500 fill-current' : 'text-gray-500'}`}
                  />
                  <span className="text-gray-700">{comment.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-primary focus:ring-primary" 
              />
              <span className="text-sm text-gray-600">Post anonymously</span>
            </label>
            <Button>Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}