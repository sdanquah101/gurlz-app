import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFashionStore } from '../store/fashionStore';
import Button from '../components/common/Button';
import TrendPost from '../components/fashion/TrendPost';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, likeTrend, removeFromWishlist } = useFashionStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/fashion')}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Fashion
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-secondary-light/90">Your saved fashion inspirations</p>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <TrendPost
                post={item}
                onLike={likeTrend}
                onAddToWishlist={removeFromWishlist}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Button onClick={() => navigate('/fashion')}>
            Browse Fashion Trends
          </Button>
        </div>
      )}
    </div>
  );
}