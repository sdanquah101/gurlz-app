import React from 'react';
import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  phase: 'inhale' | 'hold' | 'exhale';
  progress: number;
}

export default function BreathingAnimation({ phase, progress }: BreathingAnimationProps) {
  const baseSize = 200;
  const maxScale = 1.5;

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1 + (progress * (maxScale - 1));
      case 'exhale':
        return maxScale - (progress * (maxScale - 1));
      default:
        return maxScale;
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circles */}
      <motion.div
        className="absolute rounded-full bg-primary/5"
        style={{
          width: baseSize,
          height: baseSize
        }}
        animate={{
          scale: getScale()
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute rounded-full bg-primary/10"
        style={{
          width: baseSize * 0.8,
          height: baseSize * 0.8
        }}
        animate={{
          scale: getScale()
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Main circle */}
      <motion.div
        className="rounded-full bg-primary"
        style={{
          width: baseSize * 0.6,
          height: baseSize * 0.6
        }}
        animate={{
          scale: getScale()
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-full flex items-center justify-center text-white font-medium">
          {phase === 'inhale' && 'Inhale'}
          {phase === 'hold' && 'Hold'}
          {phase === 'exhale' && 'Exhale'}
        </div>
      </motion.div>
    </div>
  );
}