import React, { useState, useEffect, useCallback } from 'react';
import { Camera, MapPin, Edit2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import EditProfileModal from './EditProfileModal';

interface User {
  id: string;
  username: string;
  email: string;
  gender?: string;
  country?: string;
  phoneNumber?: string;
  ageGroup?: string;
  profileImage?: string;
  bio?: string;
}

interface ProfileHeaderProps {
  userId: string;
  onUpdateProfile?: (data: {
    username?: string;
    bio?: string;
    profileImage?: string;
  }) => void;
}

export default function ProfileHeader({ userId, onUpdateProfile }: ProfileHeaderProps) {
  const { user: currentUser, fetchUserFromSupabase } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Function to load profile data
  const loadProfileData = useCallback(async () => {
    if (!userId || hasLoaded) return;

    setIsLoading(true);
    try {
      console.log('Fetching profile data for userId:', userId);
      const userData = await fetchUserFromSupabase(userId);
      if (userData) {
        console.log('Profile data loaded:', userData);
        setProfileUser(userData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [userId, fetchUserFromSupabase, hasLoaded]);

  // Load profile data when component mounts or userId changes
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Reset hasLoaded when userId changes
  useEffect(() => {
    setHasLoaded(false);
  }, [userId]);

  const handleProfileUpdate = async (data: {
    username?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(data);
      }
      // Reload profile data after update
      setHasLoaded(false);
      await loadProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setShowEditModal(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-24">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="relative bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {profileUser.profileImage && !imageError ? (
              <img
                src={profileUser.profileImage}
                alt={`${profileUser.username}'s profile`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {profileUser.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          {isOwnProfile && (
            <button
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit profile picture"
            >
              <Camera size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileUser.username}
              </h2>
              {profileUser.email && (
                <p className="text-gray-500">{profileUser.email}</p>
              )}
            </div>
            {isOwnProfile && (
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                aria-label="Edit profile details"
              >
                <Edit2 size={16} className="mr-2" aria-hidden="true" />
                Edit Profile
              </Button>
            )}
          </div>

          {profileUser.bio && (
            <p className="mt-2 text-gray-600">
              {profileUser.bio}
            </p>
          )}

          {profileUser.country && (
            <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
              <MapPin size={16} className="mr-1" aria-hidden="true" />
              <span>{profileUser.country}</span>
            </div>
          )}
        </div>
      </div>

      {showEditModal && isOwnProfile && (
        <EditProfileModal
          currentUsername={profileUser.username}
          currentBio={profileUser.bio}
          currentImage={profileUser.profileImage}
          id={profileUser.id}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}