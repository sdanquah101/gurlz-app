import React from 'react';
import { motion } from 'framer-motion';

interface BoardProps {
  board: Array<'X' | 'O' | null>;
  onCellClick: (index: number) => void;
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
}

export default function Board({ board, onCellClick, currentPlayer, winner }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-primary/5 p-2 rounded-xl">
      {board.map((cell, index) => (
        <motion.button
          key={index}
          whileHover={!cell && !winner ? { scale: 0.95 } : {}}
          whileTap={!cell && !winner ? { scale: 0.9 } : {}}
          onClick={() => onCellClick(index)}
          disabled={!!cell || !!winner}
          className={`
            aspect-square rounded-lg flex items-center justify-center text-3xl font-bold
            ${!cell && !winner ? 'hover:bg-primary/10' : ''}
            ${cell ? 'bg-white' : 'bg-white/50'}
            ${winner ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {cell && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cell === 'X' ? 'text-primary' : 'text-secondary-dark'}
            >
              {cell}
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
}