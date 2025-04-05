import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, MessageCircle, Store } from 'lucide-react';
import Button from '../common/Button';
import TrendPost from './TrendPost';
import { TrendPost as TrendPostType } from '../../types/fashion';

interface VendorProfileProps {
  vendor: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    description?: string;
    location?: string;
    joinDate?: Date;
  };
  trends: TrendPostType[];
  onClose: () => void;
  onLike: (id: string) => void;
  onAddToWishlist: (id: string) => void;
}

export default function VendorProfile({
  vendor,
  trends,
  onClose,
  onLike,
  onAddToWishlist
}: VendorProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 overflow-y-auto z-50"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-xl w-full max-w-4xl"
        >
          {/* Vendor Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Store className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-yellow-500">
                      <Star size={18} className="fill-current" />
                      <span className="ml-1 font-medium">{vendor.rating}</span>
                    </div>
                    <span className="text-gray-500">
                      {vendor.totalSales} sales
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>
                  <MessageCircle size={20} className="mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {vendor.description && (
              <p className="text-gray-600 mt-4">{vendor.description}</p>
            )}

            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              {vendor.location && (
                <span>📍 {vendor.location}</span>
              )}
              {vendor.joinDate && (
                <span>Joined {vendor.joinDate.toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {/* Vendor Products */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Products by {vendor.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends
                .filter(trend => trend.vendor?.id === vendor.id)
                .map(trend => (
                  <TrendPost
                    key={trend.id}
                    post={trend}
                    onLike={onLike}
                    onAddToWishlist={onAddToWishlist}
                  />
                ))
              }
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}