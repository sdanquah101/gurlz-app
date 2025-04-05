import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { gameSocket } from '../../../services/gameSocket';
import { WordScrambleState } from '../../../types/games';
import WordDisplay from './WordDisplay';
import GameControls from './GameControls';
import { motion } from 'framer-motion';
import { shuffleWord } from '../../../utils/gameUtils';

const GAME_DURATION = 60; // seconds

export default function WordScramble() {
  const { gameState: currentGameState } = useGameStore();
  const [wordState, setWordState] = useState<WordScrambleState>({
    currentWord: '',
    scrambledWord: '',
    guessedWords: [],
    timeRemaining: GAME_DURATION,
    score: 0
  });
  const [guess, setGuess] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (wordState.timeRemaining > 0) {
        setWordState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [wordState.timeRemaining]);

  useEffect(() => {
    gameSocket.onGameMove((move) => {
      if (move.moveType === 'wordscramble') {
        // Handle opponent's move
      }
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  const handleSubmitGuess = () => {
    if (guess.toLowerCase() === wordState.currentWord.toLowerCase()) {
      setWordState(prev => ({
        ...prev,
        score: prev.score + 10,
        guessedWords: [...prev.guessedWords, prev.currentWord]
      }));
      
      gameSocket.makeMove({
        gameId: currentGameState?.gameType || '',
        playerId: 'current-player',
        moveType: 'wordscramble',
        value: guess,
        timestamp: new Date()
      });
      
      getNewWord();
    }
    setGuess('');
  };

  const getNewWord = () => {
    const words = ['ELEGANT', 'GRACEFUL', 'POISED', 'REFINED', 'SOPHISTICATED'];
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWordState(prev => ({
      ...prev,
      currentWord: newWord,
      scrambledWord: shuffleWord(newWord)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <WordDisplay 
          scrambledWord={wordState.scrambledWord}
          timeRemaining={wordState.timeRemaining}
          score={wordState.score}
        />
        
        <GameControls
          guess={guess}
          setGuess={setGuess}
          onSubmit={handleSubmitGuess}
          disabled={wordState.timeRemaining === 0}
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-primary mb-4">Guessed Words</h3>
          <div className="grid grid-cols-2 gap-4">
            {wordState.guessedWords.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-3 rounded-lg shadow-sm"
              >
                {word}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}