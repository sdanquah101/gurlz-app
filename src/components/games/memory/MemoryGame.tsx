import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { gameSocket } from '../../../services/gameSocket';
import { MemoryCard, MemoryGameState } from '../../../types/games';
import Card from './Card';
import GameStats from './GameStats';
import { motion } from 'framer-motion';

const FLIP_DELAY = 1000;
const initialCards: MemoryCard[] = [
  { id: 1, value: '🦋', isFlipped: false, isMatched: false },
  { id: 2, value: '🌸', isFlipped: false, isMatched: false },
  { id: 3, value: '🌺', isFlipped: false, isMatched: false },
  { id: 4, value: '🌻', isFlipped: false, isMatched: false },
  { id: 5, value: '🦋', isFlipped: false, isMatched: false },
  { id: 6, value: '🌸', isFlipped: false, isMatched: false },
  { id: 7, value: '🌺', isFlipped: false, isMatched: false },
  { id: 8, value: '🌻', isFlipped: false, isMatched: false },
].sort(() => Math.random() - 0.5);

export default function MemoryGame() {
  const { gameState: currentGameState } = useGameStore();
  const [memoryState, setMemoryState] = useState<MemoryGameState>({
    cards: initialCards,
    flippedCards: [],
    matches: 0,
    moves: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    gameSocket.onGameMove((move) => {
      if (move.moveType === 'memory') {
        const cardId = parseInt(move.value!);
        handleCardFlip(cardId);
      }
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  const handleCardFlip = (cardId: number) => {
    if (isProcessing || memoryState.flippedCards.length >= 2) return;

    setMemoryState(prev => {
      const newCards = prev.cards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      );
      const newFlippedCards = [...prev.flippedCards, cardId];

      if (newFlippedCards.length === 2) {
        setIsProcessing(true);
        setTimeout(() => checkMatch(newFlippedCards), FLIP_DELAY);
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: prev.moves + 1,
      };
    });

    gameSocket.makeMove({
      gameId: currentGameState?.gameType || '',
      playerId: 'current-player',
      moveType: 'memory',
      value: cardId.toString(),
      timestamp: new Date()
    });
  };

  const checkMatch = (flippedCardIds: number[]) => {
    const [firstId, secondId] = flippedCardIds;
    const firstCard = memoryState.cards.find(card => card.id === firstId);
    const secondCard = memoryState.cards.find(card => card.id === secondId);

    if (firstCard?.value === secondCard?.value) {
      setMemoryState(prev => ({
        ...prev,
        cards: prev.cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ),
        flippedCards: [],
        matches: prev.matches + 1,
      }));
    } else {
      setMemoryState(prev => ({
        ...prev,
        cards: prev.cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card
        ),
        flippedCards: [],
      }));
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <GameStats
          moves={memoryState.moves}
          matches={memoryState.matches}
          opponent={currentGameState?.opponent}
        />

        <div className="grid grid-cols-4 gap-4">
          {memoryState.cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onFlip={() => handleCardFlip(card.id)}
              disabled={isProcessing || card.isMatched || card.isFlipped}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}