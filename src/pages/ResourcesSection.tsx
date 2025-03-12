import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResourcesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase.from('articles').select('*');
      if (error) {
        console.error('Error fetching resources:', error);
      } else {
        setResources(data);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/physical')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Physical
        </Button>
        <h1 className="text-3xl font-bold mb-2">Physical Health Resources</h1>
        <p className="text-secondary-light/90">Discover helpful resources for your physical health</p>
      </div>


      <div className="p-4 sm:p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0px 4px 15px rgba(0,0,0,0.3)' }}
              className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => openModal(resource)}
            >
              <img
                src={resource.image_url || '/placeholder-image.jpg'}
                alt={resource.title}
                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg text-gray-800">{resource.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <span>{resource.category}</span>
                <span>{resource.read_time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedArticle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative overflow-y-auto max-h-[80vh]">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            {/* Article Content */}
            <h2 className="text-3xl font-bold text-primary mb-4">{selectedArticle.title}</h2>
            <img
              src={selectedArticle.image_url || '/placeholder-image.jpg'}
              alt={selectedArticle.title}
              className="w-full h-60 object-cover rounded-lg mb-6"
            />
            <p className="text-lg text-gray-700 mb-6">{selectedArticle.text_1}</p>
            <img
              src={selectedArticle.image_1 || '/placeholder-image.jpg'}
              alt="Section Image 1"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <p className="text-lg text-gray-700 mb-6">{selectedArticle.text_2}</p>
            <img
              src={selectedArticle.image_2 || '/placeholder-image.jpg'}
              alt="Section Image 2"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <p className="text-lg text-gray-700">{selectedArticle.text_3}</p>

            {/* Author Details */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-primary">About the Author</h3>
              <p className="text-lg font-medium text-gray-800">{selectedArticle.author_name}</p>
              <p className="text-sm text-gray-600">{selectedArticle.author_role}</p>
              <p className="text-gray-700 mt-2">{selectedArticle.author_bio}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
