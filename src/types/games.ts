import { User } from './index';

export type GameType = 'tictactoe' | 'wordscramble' | 'memory' | 'quiz';

export interface GameState {
  gameType: GameType;
  opponent: User;
  startTime: Date;
  status: 'active' | 'completed' | 'abandoned';
  winner?: User;
}

export interface GameInvite {
  id: string;
  from: User;
  to: User;
  gameType: GameType;
  timestamp: Date;
}

export interface GameMove {
  gameId: string;
  playerId: string;
  moveType: string;
  position?: number;
  value?: string;
  timestamp: Date;
}

// Tic Tac Toe Types
export interface TicTacToeState {
  board: Array<'X' | 'O' | null>;
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
}

// Word Scramble Types
export interface WordScrambleState {
  currentWord: string;
  scrambledWord: string;
  guessedWords: string[];
  timeRemaining: number;
  score: number;
}

// Memory Game Types
export interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryGameState {
  cards: MemoryCard[];
  flippedCards: number[];
  matches: number;
  moves: number;
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizGameState {
  currentQuestion: number;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  timeRemaining: number;
}