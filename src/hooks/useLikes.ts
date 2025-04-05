import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { localChat } from '../lib/local/chat';

interface UseLikesReturn {
  isLiked: boolean;
  likeCount: number;
  isLoading: boolean;
  error: string | null;
  toggleLike: () => Promise<boolean>;
  like: () => Promise<boolean>;
  unlike: () => Promise<boolean>;
  resetError: () => void;
}

interface UseLikesProps {
  itemId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  type: 'story' | 'comment';
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

export function useLikes({
  itemId,
  initialLikeCount = 0,
  initialIsLiked = false,
  type,
  onLikeChange
}: UseLikesProps): UseLikesReturn {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore(state => state.user);

  const handleError = (operation: string, err: any) => {
    console.error(`Error ${operation}:`, err);
    setError(`Failed to ${operation}. Please try again.`);
    setIsLoading(false);
    return false;
  };

  const like = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('Please login to like');
      return false;
    }

    if (isLiked) return true;
    setIsLoading(true);

    try {
      const result = type === 'story'
        ? await localChat.likeStory(itemId)
        : await localChat.likeComment(itemId);

      if (result) {
        const newCount = likeCount + 1;
        setLikeCount(newCount);
        setIsLiked(true);
        onLikeChange?.(newCount, true);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      return handleError('like', err);
    } finally {
      setIsLoading(false);
    }
  }, [itemId, isLiked, likeCount, type, user, onLikeChange]);

  const unlike = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('Please login to unlike');
      return false;
    }

    if (!isLiked) return true;
    setIsLoading(true);

    try {
      const result = type === 'story'
        ? await localChat.unlikeStory(itemId)
        : await localChat.unlikeComment(itemId);

      if (result) {
        const newCount = Math.max(0, likeCount - 1);
        setLikeCount(newCount);
        setIsLiked(false);
        onLikeChange?.(newCount, false);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      return handleError('unlike', err);
    } finally {
      setIsLoading(false);
    }
  }, [itemId, isLiked, likeCount, type, user, onLikeChange]);

  const toggleLike = useCallback(async (): Promise<boolean> => {
    return isLiked ? unlike() : like();
  }, [isLiked, like, unlike]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Optional: Add debouncing for rapid like/unlike toggling
  const debouncedToggleLike = useCallback(async () => {
    if (isLoading) return false;
    return toggleLike();
  }, [isLoading, toggleLike]);

  return {
    isLiked,
    likeCount,
    isLoading,
    error,
    toggleLike: debouncedToggleLike,
    like,
    unlike,
    resetError
  };
}

// Example usage:
/*
const MyComponent = ({ storyId }: { storyId: string }) => {
  const {
    isLiked,
    likeCount,
    isLoading,
    error,
    toggleLike
  } = useLikes({
    itemId: storyId,
    type: 'story',
    initialLikeCount: 0,
    initialIsLiked: false,
    onLikeChange: (newCount, isLiked) => {
      console.log(`New like count: ${newCount}, Is liked: ${isLiked}`);
    }
  });

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
    >
      {isLiked ? 'Unlike' : 'Like'} ({likeCount})
      {error && <span className="text-red-500">{error}</span>}
    </button>
  );
};
*/