import React from 'react';
import { User } from '../../../types';
import { motion } from 'framer-motion';

interface GameStatusProps {
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
  opponent?: User;
}

export default function GameStatus({ currentPlayer, winner, opponent }: GameStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-2"
    >
      <h2 className="text-2xl font-bold text-primary">
        {winner ? (
          winner === 'draw' ? (
            "It's a Draw!"
          ) : (
            `Player ${winner} Wins!`
          )
        ) : (
          `Player ${currentPlayer}'s Turn`
        )}
      </h2>
      {opponent && (
        <p className="text-gray-600">
          Playing against: {opponent.username}
        </p>
      )}
    </motion.div>
  );
}