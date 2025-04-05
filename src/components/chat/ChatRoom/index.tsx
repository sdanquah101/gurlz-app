// Add to imports
import { useProfileActivity } from '../../../hooks/useProfileActivity';

// Inside ChatRoom component
const { logActivity } = useProfileActivity();

// Update handleSubmitComment
const handleSubmitComment = (content: string, isAnonymous: boolean) => {
  if (!user) return;
  
  addComment(chat.id, {
    id: Date.now().toString(),
    content,
    author: {
      id: user.id,
      username: user.username
    },
    isAnonymous,
    timestamp: new Date().toISOString()
  });

  logActivity('chat', `Posted a ${isAnonymous ? 'anonymous ' : ''}message in ${chat.topic}`);
};