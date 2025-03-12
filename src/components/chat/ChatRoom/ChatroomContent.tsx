import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatroomHeader from './ChatroomHeader';
import SearchBar from './SearchBar';
import SortingOptions from './SortingOptions';
import StoryFeed from './StoryFeed';
import CreatePostModal from './CreatePostModal';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';

export default function ChatroomContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comments'>('latest');
  
  const { messages, addMessage, likeMessage } = useChatStore();
  const user = useAuthStore(state => state.user);

  const handleCreatePost = (content: string, isAnonymous: boolean) => {
    if (!user) return;

    const colors = [
      'bg-purple-50',
      'bg-orange-50',
      'bg-yellow-50',
      'bg-pink-50',
      'bg-blue-50',
      'bg-green-50'
    ];

    addMessage({
      id: Date.now().toString(),
      content,
      author: {
        id: user.id,
        username: user.username
      },
      isAnonymous,
      timestamp: new Date(),
      likes: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  };

  const filteredAndSortedStories = messages
    .filter(message => 
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!message.isAnonymous && message.author.username.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'comments':
          return b.comments.length - a.comments.length;
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <ChatroomHeader onCreatePost={() => setShowCreateModal(true)} />
      
      <div className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <SortingOptions selectedSort={sortBy} onSortChange={setSortBy} />
        
        <StoryFeed
          stories={filteredAndSortedStories}
          onStoryClick={(id) => console.log('View story:', id)}
          onLike={likeMessage}
        />
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </AnimatePresence>
    </div>
  );
}