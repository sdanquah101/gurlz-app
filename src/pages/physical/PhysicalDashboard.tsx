import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Users, Utensils, Activity, Target, Calendar, Book, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from '../../components/physical/FeatureCard';

export default function PhysicalDashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Fitness Assessment",
      description: "Take our comprehensive fitness evaluation",
      icon: Activity,
      color: "bg-rose-500",
      path: "/physical/fitness-assessment"
    },
   
    {
      title: "Goal Setting and Daily Activity Tracking",
      description: "Set and track fitness goals",
      icon: Target,
      color: "bg-blue-500",
      path: "/physical/goals"
    },
    {
      title: "Physical Health Resources",
      description: "Learn about physical health topics",
      icon: BookOpen,
      color: "bg-primary",
      path: "/physical/resources"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Physical Wellness</h1>
        <p className="text-secondary-light/90">Your journey to a healthier lifestyle</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FeatureCard
              {...feature}
              onClick={() => navigate(feature.path)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}