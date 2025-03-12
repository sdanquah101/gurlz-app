import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFashionStore } from '../store/fashionStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function InterestBinPage() {
  const navigate = useNavigate();
  const { trends, interestBin, removeFromInterestBin } = useFashionStore();
  
  // Get saved trends
  const savedTrends = trends.filter(trend => interestBin.includes(trend.id));

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
        <h1 className="text-3xl font-bold mb-2">My Interest Bin</h1>
        <p className="text-secondary-light/90">Your saved fashion inspirations</p>
      </div>

      {/* Saved Trends Grid */}
      {savedTrends.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedTrends.map((trend) => (
            <Card key={trend.id} className="relative overflow-hidden aspect-[3/4] group">
              <img
                src={trend.imageUrl}
                alt={trend.description}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <p className="text-white text-sm">{trend.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromInterestBin(trend.id)}
                    className="w-full text-white border-white hover:bg-white/20"
                  >
                    Remove from Bin
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">Your interest bin is empty</p>
          <Button onClick={() => navigate('/fashion')}>
            Browse Fashion Trends
          </Button>
        </div>
      )}
    </div>
  );
}