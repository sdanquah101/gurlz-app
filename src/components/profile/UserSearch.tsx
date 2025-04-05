import React, { useState } from 'react';
import { Search, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUsers } from '../../hooks/useUsers';
import Button from '../common/Button';

interface UserSearchProps {
  onUserSelect: (userId: string) => void;
}

export default function UserSearch({ onUserSelect }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredUsers } = useUsers(searchQuery);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="text-primary" size={24} />
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{user.username}</h4>
                <p className="text-sm text-gray-500 capitalize">{user.type}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUserSelect(user.id)}
            >
              View Profile
            </Button>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}