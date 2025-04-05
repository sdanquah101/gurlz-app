import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';

// Types for our database records
interface Comment {
  id: number;
  user_id: string;
  video_id: string;
  content: string;
  created_at: string;
  username: string; // Added username field
}

interface VideoLike {
  id: number;
  user_id: string;
  video_id: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  instructor: string;
  duration: string;
  created_at: string;
}

export default function WellnessVideo() {
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestVideo();
  }, []);

  const fetchLatestVideo = async () => {
    setIsLoading(true);
    try {
      // Fetch the latest video
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (videoError) throw videoError;
      if (!videoData) throw new Error('No video available');

      setVideo(videoData);

      // Fetch comments for the video along with usernames
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*, profiles(username)') // Join with profiles table to get username
        .eq('video_id', videoData.id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Map comments to include username
      const mappedComments = commentsData.map((comment: any) => ({
        ...comment,
        username: comment.profiles?.username || 'Unknown',
      }));

      setComments(mappedComments || []);

      // Fetch likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('video_likes')
        .select('*', { count: 'exact' })
        .eq('video_id', videoData.id);

      if (likesError) throw likesError;
      setLikesCount(likesCount || 0);

      // Check if the current user has liked the video
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: userLike, error: userLikeError } = await supabase
          .from('video_likes')
          .select('*')
          .eq('video_id', videoData.id)
          .eq('user_id', currentUser.id)
          .single();

        if (userLikeError && userLikeError.code !== 'PGRST116') throw userLikeError;
        setLiked(!!userLike);
      }

      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || !video) {
        setError('You must be logged in to like videos');
        return;
      }

      if (liked) {
        await supabase
          .from('video_likes')
          .delete()
          .eq('video_id', video.id)
          .eq('user_id', currentUser.id);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('video_likes')
          .insert([{ video_id: video.id, user_id: currentUser.id }]);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      setError('Failed to update like status');
    }
  };

  const handlePostComment = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || !newComment.trim() || !video) {
        setError('You must be logged in and provide a comment');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{ video_id: video.id, user_id: currentUser.id, content: newComment.trim() }])
        .select()
        .single();

      if (error) throw error;

      // Fetch the username for the new comment
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      setComments(prev => [
        { ...data, username: profile?.username || 'Unknown' },
        ...prev,
      ]);
      setNewComment('');
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading video content...</div>;

  if (error) return (
    <div className="p-8">
      <div className="text-red-500 mb-4">{error}</div>
      <Button variant="secondary" onClick={() => navigate('/mental')}>Back to Dashboard</Button>
    </div>
  );

  if (!video) return (
    <div className="p-8 text-center">
      <div className="text-red-500 mb-4">No video available</div>
      <Button variant="secondary" onClick={() => navigate('/mental')}>Back to Dashboard</Button>
    </div>
  );

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 sm:p-8 rounded-3xl">
        <Button variant="secondary" size="sm" onClick={() => navigate('/mental')} className="mb-4">
          <ArrowLeft size={20} className="mr-2" /> Back to Mental Wellness
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Daily Wellness Video</h1>
        <p className="text-secondary-light/90 text-sm sm:text-base">Your daily dose of mental wellness</p>
      </div>

      {/* Video Player */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={video.url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{video.title}</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                with {video.instructor} • {video.duration}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${liked ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
              >
                <ThumbsUp size={20} className={liked ? 'fill-current' : ''} />
                <span>{likesCount}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-sm sm:text-base">{video.description}</p>

          {/* Comments Section */}
          <div className="border-t pt-4 sm:pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
              <MessageCircle size={20} className="mr-2" /> Discussion ({comments.length})
            </h3>
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 sm:p-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
              />
              <Button onClick={handlePostComment} disabled={!newComment.trim()} className="w-full sm:w-auto">
                Post Comment
              </Button>
              <div className="space-y-4 mt-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 sm:p-4 bg-gray-100 rounded-xl border border-gray-300"
                  >
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{comment.username}</p>
                    <p className="text-gray-700 text-sm sm:text-base">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
