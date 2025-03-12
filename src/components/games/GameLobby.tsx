import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { GameType } from '../../types/games';
import { useGameStore } from '../../store/gameStore';
import { gameSocket } from '../../services/gameSocket';
import { useGameInitialization } from '../../hooks/useGameInitialization';
import Button from '../common/Button';
import { UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameLobbyProps {
  gameType: GameType;
  gameName: string;
}

export default function GameLobby({ gameType, gameName }: GameLobbyProps) {
  const navigate = useNavigate();
  const { onlinePlayers, startGame } = useGameStore();

  // Initialize game socket and listeners
  useGameInitialization();

  const handlePlayerSelect = (opponent: User) => {
    gameSocket.invitePlayer(opponent, gameType);
    startGame(gameType, opponent);
    navigate(`/games/${gameType}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">{gameName} Lobby</h2>
        <p className="text-gray-600">Select a player to start the game</p>
      </div>

      <div className="space-y-4">
        {onlinePlayers.length > 0 ? (
          onlinePlayers.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{player.username}</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <Button onClick={() => handlePlayerSelect(player)}>
                Challenge
              </Button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No players available at the moment</p>
            <p className="text-sm text-gray-400 mt-2">Wait for someone to join or invite a friend</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}