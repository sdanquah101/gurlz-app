import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Brain, Wind, BookOpen, ClipboardCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

export default function MentalDashboard() {
  const navigate = useNavigate();

  // Function to handle video navigation
  const handleVideoNavigation = () => {
    // You can replace this with your actual video ID
    const videoId = 'Us5w3RU2V3Q';
    navigate(`/mental/video/${videoId}`);
  };

  const features = [
    {
      title: "Daily Wellness Video",
      description: "Watch today's 5-minute mental wellness video",
      icon: Video,
      color: "bg-rose-500",
      onClick: handleVideoNavigation // Use custom handler for video
    },
    {
      title: "Mood Tracker",
      description: "Track and analyze your daily mood patterns",
      icon: Brain,
      color: "bg-violet-500",
      path: "/mental/mood"
    },
    {
      title: "Breathing Exercise",
      description: "Guided breathing exercises for stress relief",
      icon: Wind,
      color: "bg-blue-500",
      path: "/mental/breathing"
    },
    {
      title: "Wellness Resources",
      description: "Access mental health resources and guides",
      icon: BookOpen,
      color: "bg-emerald-500",
      path: "/mental/resources"
    },
    {
      title: "Wellness Quiz",
      description: "Take our comprehensive mental wellness evaluation",
      icon: ClipboardCheck,
      color: "bg-amber-500",
      path: "/mental/quiz"
    },
    {
      title: "Professional Help",
      description: "Connect with mental health professionals",
      icon: Calendar,
      color: "bg-primary",
      path: "/mental/appointment"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Mental Wellness</h1>
        <p className="text-secondary-light/90">Take care of your mental well-being</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => feature.onClick ? feature.onClick() : navigate(feature.path)}
            className="cursor-pointer"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${feature.color} text-white`}>
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Section remains the same */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mental/breathing')}
            className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300"
          >
            <Wind className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm text-blue-700">Quick Breathing</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mental/mood')}
            className="p-4 rounded-xl bg-violet-50 hover:bg-violet-100 transition-all duration-300"
          >
            <Brain className="w-6 h-6 text-violet-500 mx-auto mb-2" />
            <span className="text-sm text-violet-700">Log Mood</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mental/resources')}
            className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all duration-300"
          >
            <BookOpen className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <span className="text-sm text-emerald-700">Resources</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mental/appointment')}
            className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300"
          >
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <span className="text-sm text-primary">Get Help</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}