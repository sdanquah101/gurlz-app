import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Star, X, Search } from 'lucide-react';
import { Vendor } from '../../types/fashion';

interface VendorSearchProps {
  onClose: () => void;
  onVendorSelect: (vendorId: string) => void;
}

const demoVendors: Vendor[] = [
  {
    id: '1',
    name: 'Grace Styles',
    rating: 4.8,
    totalSales: 156
  },
  {
    id: '2',
    name: 'African Prints Co.',
    rating: 4.6,
    totalSales: 98
  },
  // Add more demo vendors...
];

export default function VendorSearch({ onClose, onVendorSelect }: VendorSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredVendors = demoVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Find Vendors</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Vendors List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredVendors.map((vendor) => (
              <motion.button
                key={vendor.id}
                onClick={() => onVendorSelect(vendor.id)}
                className="w-full p-4 rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Store className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="fill-current" />
                        <span className="ml-1 text-sm">{vendor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {vendor.totalSales} sales
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}