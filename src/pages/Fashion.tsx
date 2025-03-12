import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Button from '../components/common/Button';
import InspirationPost from '../components/fashion/InspirationPost';
import TrendSearch from '../components/fashion/TrendSearch';
import UploadModal from '../components/fashion/UploadModal';

export default function Fashion() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPostsWithRelations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('girlture_posts')
        .select(
          `
          *,
          profiles!author_id (
            username,
            avatar_url
          ),
          girlture_comments!fk_post_id (
            id,
            content,
            created_at,
            profiles!author_id (
              username
            )
          ),
          girlture_likes!fk_post_id (
            id,
            user_id
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return null;
      }

      // Transform and validate the data
      const transformedPosts =
        data?.map((post) => ({
          ...post,
          images: Array.isArray(post.images) ? post.images : [],
          description: post.description || '',
          tags: Array.isArray(post.tags) ? post.tags : [],
          likes: post.girlture_likes?.length || 0,
          liked: user
            ? post.girlture_likes?.some((like) => like.user_id === user.id)
            : false,
          comments:
            post.girlture_comments?.map((comment) => ({
              ...comment,
              author: {
                username: comment.profiles?.username || 'Anonymous',
              },
            })) || [],
        })) || [];

      return transformedPosts;
    } catch (error) {
      console.error('Error in fetchPostsWithRelations:', error);
      return null;
    }
  };

  // Load posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const posts = await fetchPostsWithRelations();
        if (posts) {
          setPosts(posts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Fetch saved posts for the current user
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error fetching user:', userError);
          return;
        }

        if (user) {
          const { data, error } = await supabase
            .from('girlture_saved_posts')
            .select('post_id')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching saved posts:', error);
          } else {
            setSavedPosts(data.map((item) => item.post_id));
          }
        }
      } catch (error) {
        console.error('Error in fetchSavedPosts:', error);
      }
    };

    fetchSavedPosts();
  }, []);

  const handleRefreshPosts = async () => {
    const posts = await fetchPostsWithRelations();
    if (posts) {
      setPosts(posts);
    }
  };

  const handleLike = async (postId) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) {
        alert('You must be logged in to like posts.');
        return;
      }

      // Check if user has already liked the post
      const { data: existingLike, error: likeCheckError } = await supabase
        .from('girlture_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (likeCheckError && likeCheckError.code !== 'PGRST116') {
        // 'PGRST116' = No rows returned. If it's some other error, throw it.
        throw likeCheckError;
      }

      if (existingLike) {
        // Unlike if already liked
        const { error: unlikeError } = await supabase
          .from('girlture_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (unlikeError) throw unlikeError;
      } else {
        // Like if not already liked
        const { error: likeError } = await supabase
          .from('girlture_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (likeError) throw likeError;
      }

      // Refresh posts to update UI
      await handleRefreshPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) {
        alert('You must be logged in to delete posts.');
        return;
      }

      // First delete related records
      const deletions = [
        supabase.from('girlture_comments').delete().eq('post_id', postId),
        supabase.from('girlture_likes').delete().eq('post_id', postId),
        supabase.from('girlture_saved_posts').delete().eq('post_id', postId),
      ];
      await Promise.all(deletions);

      // Then delete the post itself
      const { error } = await supabase
        .from('girlture_posts')
        .delete()
        .eq('id', postId);

      if (error) throw new Error(error.message);

      alert('Post deleted successfully');
      await handleRefreshPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) {
        alert('You must be logged in to comment.');
        return;
      }

      const { error } = await supabase.from('girlture_comments').insert({
        post_id: postId,
        author_id: user.id,
        content,
      });

      if (error) throw new Error(error.message);

      await handleRefreshPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleUpload = async (data) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) {
        alert('You must be logged in to upload posts.');
        return;
      }

      const { error } = await supabase.from('girlture_posts').insert({
        author_id: user.id,
        images: data.images,
        description: data.description,
        tags: data.tags,
      });

      if (error) throw new Error(error.message);

      alert('Post uploaded successfully!');
      setShowUpload(false);
      await handleRefreshPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  // Added handleSave to toggle saving/unsaving posts
  const handleSave = async (postId) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw new Error(userError.message);
      if (!user) {
        alert('You must be logged in to save posts.');
        return;
      }

      const isAlreadySaved = savedPosts.includes(postId);

      if (isAlreadySaved) {
        // Remove from saved
        const { error: removeError } = await supabase
          .from('girlture_saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (removeError) throw removeError;

        // Update local state
        setSavedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        // Save post
        const { error: saveError } = await supabase
          .from('girlture_saved_posts')
          .insert({ post_id: postId, user_id: user.id });

        if (saveError) throw saveError;

        // Update local state
        setSavedPosts((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  // Filter posts by search query (description & tags)
  const filteredPosts = posts.filter(
    (post) =>
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">Gurlture!</h1>
        <p className="text-secondary-light/90">
          Share your beautiful pictures with the community!
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <TrendSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="mr-2" size={20} />
            Share Inspiration
          </Button>
          <Button variant="outline" onClick={() => navigate('/saved-ideas')}>
            <Bookmark className="mr-2" size={20} />
            Saved Ideas
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <InspirationPost
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
              onDelete={handleDelete}
              isSaved={savedPosts.includes(post.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onUploadSuccess={handleUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
