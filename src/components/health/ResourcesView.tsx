import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

export default function ResourcesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('articles_reproductive')
        .select('*')
        .order('created_at', { ascending: false });
        
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
    resource.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openModal(resource)}
          >
            <img
              src={resource.image_url || '/api/placeholder/800/384'}
              alt={resource.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-teal-900">{resource.title}</h3>
              {resource.category && (
                <p className="text-sm text-teal-600 mt-1">{resource.category}</p>
              )}
              <p className="text-sm text-primary mt-2">{resource.read_time} min read</p>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && selectedArticle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-teal-900 mb-4">{selectedArticle.title}</h2>
            
            <img
              src={selectedArticle.image_url || '/api/placeholder/800/384'}
              alt={selectedArticle.title}
              className="w-full h-60 object-cover rounded-lg mb-6"
            />
            
            {selectedArticle.text_1 && (
              <p className="text-gray-700 mb-6">{selectedArticle.text_1}</p>
            )}
            
            {selectedArticle.image_1 && (
              <img
                src={selectedArticle.image_1}
                alt="Additional content"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}
            
            {selectedArticle.text_2 && (
              <p className="text-gray-700 mb-6">{selectedArticle.text_2}</p>
            )}
            
            {selectedArticle.image_2 && (
              <img
                src={selectedArticle.image_2}
                alt="Additional content"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            {(selectedArticle.author_name || selectedArticle.author_role || selectedArticle.author_bio) && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">About the Author</h3>
                {selectedArticle.author_name && (
                  <p className="font-medium text-gray-800">{selectedArticle.author_name}</p>
                )}
                {selectedArticle.author_role && (
                  <p className="text-sm text-gray-600">{selectedArticle.author_role}</p>
                )}
                {selectedArticle.author_bio && (
                  <p className="text-gray-700 mt-2">{selectedArticle.author_bio}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}