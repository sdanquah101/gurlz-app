import React from 'react';
import { motion } from 'framer-motion';
import { MemoryCard } from '../../../types/games';

interface CardProps {
  card: MemoryCard;
  onFlip: () => void;
  disabled: boolean;
}

export default function Card({ card, onFlip, disabled }: CardProps) {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        aspect-square rounded-xl cursor-pointer perspective-1000
        ${disabled ? 'cursor-default' : 'hover:shadow-lg'}
      `}
      onClick={() => !disabled && onFlip()}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full transform-style-3d"
      >
        {/* Front */}
        <div
          className={`
            absolute w-full h-full flex items-center justify-center
            bg-white rounded-xl border-2 transform backface-hidden
            ${card.isMatched ? 'border-green-500' : 'border-primary/20'}
          `}
        >
          <span className="text-4xl">{card.value}</span>
        </div>

        {/* Back */}
        <div
          className={`
            absolute w-full h-full flex items-center justify-center
            bg-primary/10 rounded-xl border-2 border-primary/20
            transform rotateY-180 backface-hidden
          `}
        >
          <span className="text-2xl">❀</span>
        </div>
      </motion.div>
    </motion.div>
  );
}