import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, GraduationCap, DollarSign, BookOpen, Briefcase, Crown, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import { ChatTopic } from '../../types';
import { useChatStore } from '../../store/chatStore';

const defaultTopics: ChatTopic[] = [
  {
    id: '1',
    name: 'Mental Health',
    description: 'Share experiences and support for mental well-being',
    category: 'mental',
    icon: 'Brain'
  },
  {
    id: '2',
    name: 'Physical Health',
    description: 'Discuss fitness, nutrition, and general health',
    category: 'physical',
    icon: 'Heart'
  },
  {
    id: '3',
    name: 'Sexual Health',
    description: 'Safe space for reproductive health discussions',
    category: 'sexual',
    icon: 'Heart'
  },
  {
    id: '4',
    name: 'Financial Wellness',
    description: 'Tips and advice for financial independence',
    category: 'financial',
    icon: 'DollarSign'
  },
  {
    id: '5',
    name: 'Academic Support',
    description: 'Academic challenges and success stories',
    category: 'academic',
    icon: 'BookOpen'
  },
  {
    id: '6',
    name: 'Career Growth',
    description: 'Career guidance and professional development',
    category: 'career',
    icon: 'Briefcase'
  },
  {
    id: '7',
    name: 'Elegant and Demure',
    description: 'Discussions about grace, etiquette, and personal development',
    category: 'elegant',
    icon: 'Crown'
  }
];

const iconMap = {
  Brain,
  Heart,
  GraduationCap,
  DollarSign,
  BookOpen,
  Briefcase,
  Crown
};

export default function ChatTopicList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'Heart'
  });

  const { topics, addTopic } = useChatStore();
  const allTopics = [...defaultTopics, ...topics];

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.name && newTopic.description && newTopic.category) {
      addTopic({
        ...newTopic,
        id: Date.now().toString(),
        category: newTopic.category.toLowerCase().replace(/\s+/g, '-')
      });
      setNewTopic({ name: '', description: '', category: '', icon: 'Heart' });
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Chat Communities</h1>
          <p className="text-gray-600">Connect, share, and grow together</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={20} className="mr-2" />
          Create Community
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/chat/${topic.category}`}
            className="transform hover:scale-105 transition-all duration-200"
          >
            <Card className="h-full">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-secondary/30 text-primary mr-4">
                  {React.createElement(iconMap[topic.icon as keyof typeof iconMap], {
                    size: 24
                  })}
                </div>
                <h3 className="text-lg font-semibold text-primary">{topic.name}</h3>
              </div>
              <p className="text-gray-600">{topic.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary">Create New Community</h3>
                <button onClick={() => setShowCreateModal(false)}>
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter community name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter category (e.g., self-care)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={3}
                    placeholder="Describe what this community is about"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={newTopic.icon}
                    onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Community
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}