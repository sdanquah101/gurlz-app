import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, DollarSign, ChevronLeft, ChevronRight, Bookmark, Store, Star } from 'lucide-react';
import Button from '../common/Button';
import BuyProduct from './BuyProduct';
import VendorRating from './VendorRating';
import { TrendPost as TrendPostType } from '../../types/fashion';

interface TrendPostProps {
  post: TrendPostType;
  onLike: (id: string) => void;
  onAddToWishlist: (id: string) => void;
  onBuy?: (id: string) => void;
  onVendorRate?: (vendorId: string, rating: number, comment?: string) => void;
}

export default function TrendPost({ 
  post, 
  onLike, 
  onAddToWishlist, 
  onBuy,
  onVendorRate 
}: TrendPostProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleImageChange = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex(currentImageIndex === 1 ? 0 : 1);
    } else {
      setCurrentImageIndex(currentImageIndex === 0 ? 1 : 0);
    }
  };

  const handleBuy = () => {
    setShowBuyModal(true);
  };

  const handlePurchase = (paymentDetails: any) => {
    // Handle purchase logic
    console.log('Purchase:', paymentDetails);
    setShowBuyModal(false);
    if (onBuy) onBuy(post.id);
  };

  const handleVendorRate = (rating: number, comment?: string) => {
    if (onVendorRate && post.vendor) {
      onVendorRate(post.vendor.id, rating, comment);
    }
  };

  return (
    <motion.div 
      layout
      className="relative bg-white rounded-xl overflow-hidden shadow-sm"
    >
      {/* Image Display */}
      <div 
        className="relative aspect-square cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <img
          src={post.images[currentImageIndex]}
          alt={post.description}
          className="w-full h-full object-cover"
        />
        
        {post.images.length > 1 && (
          <>
            <button
              onClick={(e) => handleImageChange('prev', e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => handleImageChange('next', e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Vendor Badge */}
        {post.vendor && (
          <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <Store size={14} />
            <span>{post.vendor.name}</span>
            {post.vendor.rating && (
              <div className="flex items-center ml-2">
                <Star size={12} className="fill-yellow-500 text-yellow-500" />
                <span className="ml-1">{post.vendor.rating}</span>
              </div>
            )}
          </div>
        )}

        {/* Price Badge */}
        {post.vendor && (
          <div className="absolute top-2 right-2 bg-white text-primary px-3 py-1 rounded-full text-sm font-bold">
            ₵{post.vendor.price}
          </div>
        )}
      </div>

      {/* Post Details */}
      <div className="p-4 space-y-3">
        <p className="text-gray-800">{post.description}</p>
        
        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className={post.liked ? 'fill-red-500 text-red-500' : ''} size={20} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => onAddToWishlist(post.id)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Bookmark size={20} />
            </button>
          </div>

          {post.vendor && (
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={handleBuy}>
                <DollarSign size={16} className="mr-1" />
                Buy Now
              </Button>
            </div>
          )}
        </div>

        {post.vendor && <VendorRating
          vendorId={post.vendor.id}
          currentRating={post.vendor.rating || 0}
          onRate={handleVendorRate}
        />}
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {showBuyModal && post.vendor && (
          <BuyProduct
            product={{
              id: post.id,
              name: post.description,
              price: post.vendor.price,
              vendor: {
                id: post.vendor.id,
                name: post.vendor.name
              }
            }}
            onClose={() => setShowBuyModal(false)}
            onPurchase={handlePurchase}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}