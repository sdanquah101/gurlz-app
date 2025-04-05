import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileContent from '../components/profile/ProfileContent';

export default function Profile() {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, fetchUserFromSupabase } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Determine if viewing own profile and get correct user ID
  const isOwnProfile = !routeUserId || (currentUser?.id === routeUserId);
  const displayUserId = routeUserId || currentUser?.id;

  // Check authentication once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }
        setHasCheckedAuth(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasCheckedAuth) {
      checkAuth();
    }
  }, [navigate, hasCheckedAuth]);

  // Setup real-time subscription for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleUpdateProfile = useCallback(async (data: {
    username?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    if (displayUserId) {
      try {
        await fetchUserFromSupabase(displayUserId);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }, [displayUserId, fetchUserFromSupabase]);

  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view profiles</p>
      </div>
    );
  }

  if (!displayUserId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">
          {isOwnProfile ? 'Your Profile' : 'User Profile'}
        </h1>
        <p className="text-secondary-light/90">
          {isOwnProfile ? 'Manage your profile and view your activity' : 'View profile and activity'}
        </p>
      </div>

      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Profile Header */}
        <ProfileHeader
          userId={displayUserId}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Profile Tabs and Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwnProfile={isOwnProfile}
          />

          <ProfileContent 
            activeTab={activeTab}
            userId={displayUserId}
          />
        </div>
      </motion.div>
    </div>
  );
}