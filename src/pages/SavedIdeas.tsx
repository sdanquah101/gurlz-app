import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useFashionStore } from '../store/fashionStore';
import Button from '../components/common/Button';
import InspirationPost from '../components/fashion/InspirationPost';

export default function SavedIdeas() {
  const navigate = useNavigate();
  const { savedPosts, setSavedPosts, likePost, addComment, toggleSavePost } = useFashionStore();

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

        if (!user) return;

        // IMPORTANT: specify the relationship name, e.g. "fk_post_id"
        const { data, error } = await supabase
          .from('girlture_saved_posts')
          .select(`
            post_id,
            girlture_posts!fk_post_id (
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
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching saved posts:', error);
          return;
        }

        // Transform the results to extract the actual post data
        const transformed = data.map((row) => {
          const post = row.girlture_posts;
          return {
            ...post,
            images: Array.isArray(post.images) ? post.images : [],
            description: post.description || '',
            tags: Array.isArray(post.tags) ? post.tags : [],
            likes: post.girlture_likes?.length || 0,
            liked: post.girlture_likes?.some(like => like.user_id === user.id),
            comments: post.girlture_comments?.map(comment => ({
              ...comment,
              author: {
                username: comment.profiles?.username || 'Anonymous'
              }
            })) || []
          };
        });

        setSavedPosts(transformed);
      } catch (err) {
        console.error('Error in fetchSavedPosts:', err);
      }
    };

    fetchSavedPosts();
  }, [setSavedPosts]);

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
        <h1 className="text-3xl font-bold mb-2">Saved Ideas</h1>
        <p className="text-secondary-light/90">
          Your fashion inspiration collection
        </p>
      </div>

      {/* Saved Posts Grid */}
      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <InspirationPost
                post={post}
                onLike={likePost}
                onComment={addComment}
                onSave={toggleSavePost}
                isSaved={true}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 mb-4">Your collection is empty</p>
          <Button onClick={() => navigate('/fashion')}>Browse Fashion Ideas</Button>
        </div>
      )}
    </div>
  );
}
