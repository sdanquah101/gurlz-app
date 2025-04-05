import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import CategoryFilters from './filters/CategoryFilters';
import { products, categoryNames } from '../../data/marketplace';

export default function ProductCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const categoryProducts = categoryId ? products[categoryId as keyof typeof products] : [];
  
  const filteredProducts = categoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = !activeFilters.priceRange || (
      product.price >= activeFilters.priceRange.min &&
      product.price <= activeFilters.priceRange.max
    );
    const matchesRating = !activeFilters.rating || product.rating >= activeFilters.rating;
    
    return matchesSearch && matchesPrice && matchesRating;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/marketplace')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Marketplace
        </Button>
        <h1 className="text-3xl font-bold mb-2">
          {categoryId ? categoryNames[categoryId as keyof typeof categoryNames] : 'Products'}
        </h1>
        <p className="text-secondary-light/90">Discover our curated selection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block">
          {categoryId && (
            <CategoryFilters
              category={categoryId}
              onFiltersChange={setActiveFilters}
            />
          )}
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                {categoryId && (
                  <CategoryFilters
                    category={categoryId}
                    onFiltersChange={setActiveFilters}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map((product, index) => (
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

            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}