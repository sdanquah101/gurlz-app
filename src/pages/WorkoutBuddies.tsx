import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar } from 'lucide-react';
import Button from '../components/common/Button';

const dummyBuddies = [
  {
    id: '1',
    name: 'Sarah J.',
    location: 'Downtown',
    interests: ['Running', 'Yoga'],
    availability: 'Mornings',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200'
  },
  {
    id: '2',
    name: 'Michelle K.',
    location: 'Westside',
    interests: ['HIIT', 'Swimming'],
    availability: 'Evenings',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200'
  },
  // Add more dummy data...
];

export default function WorkoutBuddies() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filteredBuddies = dummyBuddies.filter(buddy =>
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.interests.some(interest =>
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/physical')}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Physical
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Find Workout Buddies</h1>
        <p className="text-secondary-light/90">Connect with fitness enthusiasts near you</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, interests, or location..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Buddy List */}
        <div className="space-y-4">
          {filteredBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="flex items-center space-x-4 p-4 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors"
            >
              <img
                src={buddy.image}
                alt={buddy.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{buddy.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={16} className="mr-1" />
                  {buddy.location}
                  <span className="mx-2">•</span>
                  <Calendar size={16} className="mr-1" />
                  {buddy.availability}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {buddy.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <Button>
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}