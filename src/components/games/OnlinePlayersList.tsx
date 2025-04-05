import React from 'react';
import { User } from '../../types';
import { UserCircle2 } from 'lucide-react';
import Button from '../common/Button';

interface OnlinePlayersListProps {
  players: User[];
}

export default function OnlinePlayersList({ players }: OnlinePlayersListProps) {
  const demoPlayers = [
    { id: '1', username: 'Grace', status: 'online' },
    { id: '2', username: 'Emma', status: 'in-game' },
    { id: '3', username: 'Sophia', status: 'online' },
  ];

  const displayPlayers = players.length > 0 ? players : demoPlayers;

  return (
    <div className="space-y-4">
      {displayPlayers.map((player) => (
        <div 
          key={player.id} 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                player.status === 'in-game' ? 'bg-yellow-400' : 'bg-green-400'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{player.username}</p>
              <p className="text-xs text-gray-500 capitalize">{player.status}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Invite
          </Button>
        </div>
      ))}

      {displayPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No players online at the moment
        </div>
      )}
    </div>
  );
}