import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Comment } from '../types/chat';
import { localChat } from '../lib/local/chat';

interface UseCommentsReturn {
  comments: Comment[];
  replyTo: Comment | null;
  loading: boolean;
  error: string | null;
  addComment: (content: string, isAnonymous?: boolean) => Promise<boolean>;
  updateComment: (commentId: string, content: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<boolean>;
  unlikeComment: (commentId: string) => Promise<boolean>;
  addReply: (parentCommentId: string, content: string, isAnonymous?: boolean) => Promise<boolean>;
  setReplyTo: (comment: Comment | null) => void;
  clearError: () => void;
  sortComments: (sortBy: 'newest' | 'oldest' | 'mostLiked') => void;
}

export function useComments(storyId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
  
  const user = useAuthStore(state => state.user);

  // Error handler utility
  const handleError = (operation: string, err: any) => {
    console.error(`Error ${operation}:`, err);
    setError(`Failed to ${operation}. Please try again.`);
    setLoading(false);
    return false;
  };

  // Fetch comments on mount
  useEffect(() => {
    if (storyId) {
      fetchComments();
    }
  }, [storyId]);

  const fetchComments = useCallback(async () => {
    if (!storyId) return;
    setLoading(true);
    try {
      const fetchedComments = await localChat.getComments(storyId);
      setComments(fetchedComments);
      setError(null);
    } catch (err) {
      handleError('fetch comments', err);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  const addComment = useCallback(async (
    content: string,
    isAnonymous: boolean = false
  ): Promise<boolean> => {
    if (!user || !storyId) return false;
    setLoading(true);
    try {
      const newComment = await localChat.addComment(storyId, {
        content,
        authorId: user.id,
        isAnonymous
      });
      setComments(prev => sortCommentArray([...prev, newComment], sortOrder));
      setError(null);
      return true;
    } catch (err) {
      return handleError('add comment', err);
    } finally {
      setLoading(false);
    }
  }, [storyId, user, sortOrder]);

  const updateComment = useCallback(async (
    commentId: string,
    content: string
  ): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const updatedComment = await localChat.updateComment(commentId, content);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setError(null);
      return true;
    } catch (err) {
      return handleError('update comment', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      await localChat.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setError(null);
      return true;
    } catch (err) {
      return handleError('delete comment', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const likeComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await localChat.likeComment(storyId, commentId);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1, liked: true }
            : comment
        )
      );
      setError(null);
      return true;
    } catch (err) {
      return handleError('like comment', err);
    }
  }, [storyId, user]);

  const unlikeComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await localChat.unlikeComment(storyId, commentId);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: Math.max(0, comment.likes - 1), liked: false }
            : comment
        )
      );
      setError(null);
      return true;
    } catch (err) {
      return handleError('unlike comment', err);
    }
  }, [storyId, user]);

  const addReply = useCallback(async (
    parentCommentId: string,
    content: string,
    isAnonymous: boolean = false
  ): Promise<boolean> => {
    if (!user || !storyId) return false;
    setLoading(true);
    try {
      const reply = await localChat.addReply(storyId, parentCommentId, {
        content,
        authorId: user.id,
        isAnonymous
      });
      setComments(prev =>
        prev.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), reply]
              }
            : comment
        )
      );
      setError(null);
      setReplyTo(null);
      return true;
    } catch (err) {
      return handleError('add reply', err);
    } finally {
      setLoading(false);
    }
  }, [storyId, user]);

  const sortCommentArray = (commentsToSort: Comment[], order: typeof sortOrder) => {
    return [...commentsToSort].sort((a, b) => {
      switch (order) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'mostLiked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  };

  const sortComments = useCallback((order: typeof sortOrder) => {
    setSortOrder(order);
    setComments(prev => sortCommentArray(prev, order));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    comments,
    replyTo,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
    addReply,
    setReplyTo,
    clearError,
    sortComments
  };
}