import { useMemo } from 'react';
import { useProfileStore } from '../store/profileStore';
import { UserProfile } from '../types/profile';

export function useUsers(searchQuery: string) {
  const profiles = useProfileStore((state) => state.profiles);
  
  const filteredUsers = useMemo(() => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return Object.values(profiles).filter((profile) => {
      const searchableText = `${profile.username} ${profile.bio || ''} ${profile.location || ''}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [profiles, searchQuery]);

  return {
    users: Object.values(profiles),
    filteredUsers: searchQuery ? filteredUsers : Object.values(profiles)
  };
}