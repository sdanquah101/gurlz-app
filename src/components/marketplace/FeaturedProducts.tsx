import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import Button from '../common/Button';

const featuredProducts = [
  {
    id: '1',
    name: 'Natural Skincare Set',
    price: 49.99,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300',
    category: 'beauty'
  },
  {
    id: '2',
    name: 'Organic Cotton Dress',
    price: 79.99,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300',
    category: 'fashion'
  },
  {
    id: '3',
    name: 'Wellness Tea Collection',
    price: 34.99,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1563822249366-3e5c6d08c403?auto=format&fit=crop&w=300',
    category: 'wellness'
  }
];

export default function FeaturedProducts() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
        <Button variant="outline" onClick={() => navigate('/marketplace/featured')}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <span className="font-bold text-primary">${product.price}</span>
              </div>

              <Button 
                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                className="w-full"
              >
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}