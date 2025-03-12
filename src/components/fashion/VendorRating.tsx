import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

interface VendorRatingProps {
  vendorId: string;
  currentRating: number;
  onRate: (rating: number, comment?: string) => void;
}

export default function VendorRating({ vendorId, currentRating, onRate }: VendorRatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRate(rating, comment);
    setShowForm(false);
  };

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={() => setShowForm(true)}
        className="w-full"
      >
        <Star className="mr-2" size={20} />
        Rate Vendor
      </Button>

      <AnimatePresence>
        {showForm && (
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
              <h3 className="text-lg font-semibold text-primary mb-4">Rate this Vendor</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="p-1"
                    >
                      <Star
                        size={32}
                        className={`${
                          value <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this vendor..."
                  className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={4}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!rating}>
                    Submit Rating
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