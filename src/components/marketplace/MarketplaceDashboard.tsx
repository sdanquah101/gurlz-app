import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';
import FeaturedProducts from './FeaturedProducts';

export default function MarketplaceDashboard() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'beauty',
      name: 'Beauty & Skincare',
      description: 'Makeup, skincare, and beauty essentials',
      icon: Sparkles,
      color: 'bg-rose-500'
    },
    {
      id: 'fashion',
      name: 'Fashion & Clothing',
      description: 'Trendy clothing and accessories',
      icon: Heart,
      color: 'bg-violet-500'
    },
    {
      id: 'wellness',
      name: 'Wellness Products',
      description: 'Health and wellness essentials',
      icon: Star,
      color: 'bg-emerald-500'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Jewelry, bags, and more',
      icon: ShoppingBag,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
        <p className="text-secondary-light/90">Discover products for your well-being</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CategoryCard
              {...category}
              onClick={() => navigate(`/marketplace/category/${category.id}`)}
            />
          </motion.div>
        ))}
      </div>

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}