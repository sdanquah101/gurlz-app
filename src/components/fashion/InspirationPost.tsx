import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  author?: {
    username: string;
  };
  profiles?: {
    username: string;
  };
}

interface PostProps {
  post: {
    id: string;
    author_id: string;
    images?: string[];
    description?: string;
    tags?: string[];
    likes: number;
    liked?: boolean;
    profiles?: {
      username?: string;
      avatar_url?: string;
    };
    comments?: CommentType[];
  };
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onSave: (postId: string) => void;
  onDelete?: (postId: string) => void; // made optional, in case it's not always provided
  isSaved: boolean;
}

export default function InspirationPost({
  post,
  onLike,
  onComment,
  onSave,
  onDelete,
  isSaved = false,
}: PostProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  
  // New states for image gallery functionality
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  // Validate post data
  if (!post || typeof post !== 'object') {
    console.error('Invalid post data:', post);
    return null;
  }

  // Create a safe version of the post with defaults
  const safePost = {
    id: post.id || '',
    author_id: post.author_id || '',
    images: Array.isArray(post.images) ? post.images : [],
    description: post.description || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: typeof post.likes === 'number' ? post.likes : 0,
    liked: Boolean(post.liked),
    profiles: {
      username: post.profiles?.username || 'Anonymous',
      avatar_url: post.profiles?.avatar_url,
    },
    comments: Array.isArray(post.comments) ? post.comments : [],
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(safePost.id, comment.trim());
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!onDelete) return; // If onDelete is truly optional, bail out if not provided
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(safePost.id);
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === safePost.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? safePost.images.length - 1 : prevIndex - 1
    );
  };
  
  // Handle keyboard navigation when in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullScreen) return;
      
      if (e.key === 'Escape') {
        setShowFullScreen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullScreen]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Image Gallery */}
      <div className="relative aspect-square">
        {safePost.images.length > 0 ? (
          <>
            <img
              src={safePost.images[currentImageIndex]}
              alt={`${safePost.description || 'Post image'} (${currentImageIndex + 1}/${safePost.images.length})`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowFullScreen(true)}
            />
            
            {/* Image navigation controls - Only show if multiple images */}
            {safePost.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Image counter indicator */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1}/{safePost.images.length}
                </div>
              </>
            )}
            
            {/* Image dot indicators for multiple images */}
            {safePost.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {safePost.images.map((_, index) => (
                  <button 
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Fullscreen image view */}
      {showFullScreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowFullScreen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
            onClick={() => setShowFullScreen(false)}
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={safePost.images[currentImageIndex]}
              alt={`${safePost.description || 'Post image'} (fullscreen)`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {safePost.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
                
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full">
                  {currentImageIndex + 1}/{safePost.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {safePost.profiles.avatar_url && (
              <img
                src={safePost.profiles.avatar_url}
                alt={safePost.profiles.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <p className="text-sm font-medium text-gray-800">
              Posted by:{' '}
              <a
                href={`/profile/${safePost.author_id}`}
                className="text-primary hover:underline"
              >
                {safePost.profiles.username}
              </a>
            </p>
          </div>

          {currentUser?.id === safePost.author_id && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete post"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-800">{safePost.description}</p>

        {/* Tags */}
        {safePost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {safePost.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={() => onLike(safePost.id)}
              className={`flex items-center space-x-1 ${
                safePost.liked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart
                className={safePost.liked ? 'fill-current' : ''}
                size={20}
              />
              <span>{safePost.likes}</span>
            </button>

            {/* Toggle comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <MessageCircle size={20} />
              <span>{safePost.comments.length}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onSave(safePost.id)}
            className={`text-gray-500 hover:text-primary ${
              isSaved ? 'text-primary' : ''
            }`}
            title={isSaved ? 'Remove from saved' : 'Save post'}
          >
            <Bookmark className={isSaved ? 'fill-current' : ''} size={20} />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {safePost.comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {safePost.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-medium">
                      {comment.profiles?.username ||
                        comment.author?.username ||
                        'Anonymous'}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {comment.content}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={!comment.trim() || isSubmitting}>
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}