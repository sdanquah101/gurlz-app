import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface EditProfileModalProps {
  currentUsername?: string;
  currentBio?: string;
  currentImage?: string;
  id: string;
  onClose: () => void;
  onSave: (data: { username?: string; bio?: string; profileImage?: string }) => void;
}

export default function EditProfileModal({
  currentUsername,
  currentBio,
  currentImage,
  id,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { updateProfile } = useAuthStore();
  const [username, setUsername] = useState(currentUsername || '');
  const [bio, setBio] = useState(currentBio || '');
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const blobUrl = URL.createObjectURL(file);
      setImagePreview(blobUrl);

      if (!id) throw new Error('User ID is undefined');

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2)}`;
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}/${fileName}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(uploadData.path);

      URL.revokeObjectURL(blobUrl);
      setImagePreview(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
      setImagePreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      if (!imagePreview || !id) return;

      // Extract the file path from the URL
      const urlParts = imagePreview.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${id}/${fileName}`;

      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from('profile-images')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update profile with null image
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          profile_image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        updateProfile(data);
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (isUploading || isDeleting) return;

    try {
      setError(null);
      
      if (!username.trim()) {
        setError('Username is required');
        return;
      }

      const updates = {
        username: username.trim(),
        bio: bio.trim(),
        profile_image_url: imagePreview,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        updateProfile(data);
        onSave({
          username: data.username,
          bio: data.bio,
          profileImage: data.profile_image_url,
        });
      }
      
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save changes');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-primary">Edit Profile</h3>
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-end gap-4">
              <div className="relative w-20 h-20 rounded-full bg-primary/10 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading || isDeleting}
                  aria-label="Upload profile picture"
                />
                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {imagePreview && (
                <Button 
                  variant="outline" 
                  onClick={handleDeleteImage}
                  disabled={isUploading || isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border-2 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter username"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border-2 focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading || isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isUploading || isDeleting}
            >
              {isUploading || isDeleting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}