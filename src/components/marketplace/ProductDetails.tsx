import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import Button from '../common/Button';
import { useCartStore } from '../../store/cartStore';
import PaymentModal from './payment/PaymentModal';
import { products } from '../../data/products';

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { addItem } = useCartStore();

  const product = productId ? products[productId as keyof typeof products] : null;

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      vendorId: product.vendor.id,
      vendorName: product.vendor.name
    });
  };

  const handleBuyNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    console.log('Payment completed:', paymentDetails);
    setShowPaymentModal(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-secondary-light/90">by {product.vendor.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
            <motion.img
              key={currentImage}
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(i => i === 0 ? product.images.length - 1 : i - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i + 1) % product.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="flex justify-center space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors
                    ${currentImage === index ? 'bg-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Vendor Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.vendor.name}</h3>
                  <p className="text-sm text-gray-500">{product.vendor.location}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>{product.vendor.rating}</span>
                <span className="mx-2">•</span>
                <span>{product.vendor.products} products</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">₵{product.price}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setLiked(!liked)}
                  className={liked ? 'text-red-500' : ''}
                >
                  <Heart className={liked ? 'fill-current' : ''} size={20} />
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-400">
                <Star size={20} className="fill-current" />
                <span className="ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-primary"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-primary"
                  >
                    +
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1">
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} variant="outline">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={product.price * quantity}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}