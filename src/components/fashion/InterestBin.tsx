import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, X } from 'lucide-react';
import { useFashionStore } from '../../store/fashionStore';
import Button from '../common/Button';

export default function InterestBin() {
  const [showCreateBin, setShowCreateBin] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const { interestBins, trends, createBin, deleteBin, removeFromBin } = useFashionStore();

  const handleCreateBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBinName.trim()) {
      createBin(newBinName.trim());
      setNewBinName('');
      setShowCreateBin(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">Interest Bins</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateBin(true)}
        >
          <Plus size={16} className="mr-2" />
          New Bin
        </Button>
      </div>

      <AnimatePresence>
        {showCreateBin && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleCreateBin}
            className="space-y-4"
          >
            <input
              type="text"
              value={newBinName}
              onChange={(e) => setNewBinName(e.target.value)}
              placeholder="Bin name..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateBin(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">Create</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {interestBins.map((bin) => (
          <motion.div
            key={bin.id}
            layout
            className="border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Folder className="text-primary" size={20} />
                <h4 className="font-medium">{bin.name}</h4>
                <span className="text-sm text-gray-500">
                  ({bin.trends.length})
                </span>
              </div>
              <button
                onClick={() => deleteBin(bin.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              {bin.trends.map((trendId) => {
                const trend = trends.find((t) => t.id === trendId);
                if (!trend) return null;
                return (
                  <div
                    key={trendId}
                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                  >
                    <span className="truncate">{trend.description}</span>
                    <button
                      onClick={() => removeFromBin(bin.id, trendId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}