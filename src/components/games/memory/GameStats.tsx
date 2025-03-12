import React from 'react';
import { User } from '../../../types';
import { motion } from 'framer-motion';

interface GameStatsProps {
  moves: number;
  matches: number;
  opponent?: User;
}

export default function GameStats({ moves, matches, opponent }: GameStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"
    >
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Moves</p>
        <p className="text-2xl font-bold text-primary">{moves}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-500">Matches</p>
        <p className="text-2xl font-bold text-primary">{matches}/4</p>
      </div>

      {opponent && (
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Opponent</p>
          <p className="text-lg font-medium text-primary">{opponent.username}</p>
        </div>
      )}
    </motion.div>
  );
}