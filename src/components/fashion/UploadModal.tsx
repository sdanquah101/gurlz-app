import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (data: {
    images: string[];
    description: string;
    tags: string[];
  }) => Promise<void>;
}

export default function UploadModal({ onClose, onUploadSuccess }: UploadModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    setImages([...images, ...files]);
    setPreviewUrls([...previewUrls, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up object URL
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim() || images.length === 0) {
      alert('Please add a description and at least one image.');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw new Error('Authentication error: ' + userError.message);
      }

      if (!user) {
        throw new Error('You must be logged in to upload posts.');
      }

      console.log('Starting image uploads...');

      // Upload images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}_${image.name}`;
        
        console.log('Uploading image:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from('fashion-images')
          .upload(fileName, image);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicURLData } = supabase.storage
          .from('fashion-images')
          .getPublicUrl(fileName);

        if (!publicURLData?.publicUrl) {
          throw new Error('Failed to get public URL for uploaded image');
        }

        uploadedImageUrls.push(publicURLData.publicUrl);
      }

      console.log('Images uploaded successfully:', uploadedImageUrls);

      // Format tags to include hashtag
      const formattedTags = tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);

      // Call onUploadSuccess with the prepared data
      await onUploadSuccess({
        images: uploadedImageUrls,
        description: description.trim(),
        tags: formattedTags,
      });

      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Share Fashion Inspiration</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Max 4)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                  <Upload className="w-8 h-8 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
              placeholder="Share your fashion story..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Max 5)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-1 hover:text-primary-dark transition-colors"
                    title="Remove tag"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 p-2 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Add a tag..."
                  maxLength={20}
                />
                <Button 
                  onClick={handleAddTag} 
                  variant="outline" 
                  size="sm"
                  disabled={!currentTag.trim()}
                >
                  <Plus size={20} />
                </Button>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!description.trim() || images.length === 0 || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Share Inspiration'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}