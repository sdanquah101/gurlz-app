import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, MessageCircle } from 'lucide-react';
import Card from '../common/Card';

export default function FeaturedSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Wellness Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Your Wellness Journey</h2>
        <div className="grid grid-cols-1 gap-4">
          <Link to="/health" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200"
                  alt="Health Tracking"
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Health Tracking</h3>
                  <p className="text-gray-600">Monitor your cycle and wellness journey</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/mental" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200"
                  alt="Mental Wellness"
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Mental Wellness</h3>
                  <p className="text-gray-600">Daily videos and mood tracking</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Community Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Community & Growth</h2>
        <div className="grid grid-cols-1 gap-4">
          <Link to="/chat" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=200"
                  alt="Chat Communities"
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Chat Communities</h3>
                  <p className="text-gray-600">Connect with like-minded individuals</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/fashion" className="block">
            <Card className="hover:shadow-lg transition-all duration-200 bg-white/50 backdrop-blur">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=200"
<<<<<<< HEAD
                  alt="Fashion & Style"
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Fashion & Style</h3>
=======
                  alt="Gurlture"
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Gurlture!</h3>
>>>>>>> master
                  <p className="text-gray-600">Discover your unique style and elegance</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}