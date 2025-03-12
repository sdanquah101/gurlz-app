import { create } from 'zustand';
import { User } from '../types';
import { GameInvite, GameState, GameType, TicTacToeState, WordScrambleState, MemoryGameState, QuizGameState } from '../types/games';

interface GameStoreState {
  onlinePlayers: User[];
  currentGame: GameType | null;
  gameState: GameState | null;
  pendingInvites: GameInvite[];
  ticTacToeState: TicTacToeState | null;
  wordScrambleState: WordScrambleState | null;
  memoryState: MemoryGameState | null;
  quizState: QuizGameState | null;
  
  // Actions
  setOnlinePlayers: (players: User[]) => void;
  startGame: (gameType: GameType, opponent: User) => void;
  endGame: () => void;
  updateGameState: (state: GameState) => void;
  updateTicTacToeState: (state: TicTacToeState) => void;
  updateWordScrambleState: (state: WordScrambleState) => void;
  updateMemoryState: (state: MemoryGameState) => void;
  updateQuizState: (state: QuizGameState) => void;
  sendInvite: (invite: GameInvite) => void;
  acceptInvite: (inviteId: string) => void;
  rejectInvite: (inviteId: string) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  onlinePlayers: [],
  currentGame: null,
  gameState: null,
  pendingInvites: [],
  ticTacToeState: null,
  wordScrambleState: null,
  memoryState: null,
  quizState: null,

  setOnlinePlayers: (players) => set({ onlinePlayers: players }),
  
  startGame: (gameType, opponent) => set({ 
    currentGame: gameType,
    gameState: {
      gameType,
      opponent,
      startTime: new Date(),
      status: 'active'
    }
  }),
  
  endGame: () => set({ 
    currentGame: null,
    gameState: null,
    ticTacToeState: null,
    wordScrambleState: null,
    memoryState: null,
    quizState: null
  }),
  
  updateGameState: (state) => set({ gameState: state }),
  
  updateTicTacToeState: (state) => set({ ticTacToeState: state }),
  updateWordScrambleState: (state) => set({ wordScrambleState: state }),
  updateMemoryState: (state) => set({ memoryState: state }),
  updateQuizState: (state) => set({ quizState: state }),
  
  sendInvite: (invite) => set((state) => ({
    pendingInvites: [...state.pendingInvites, invite]
  })),
  
  acceptInvite: (inviteId) => set((state) => ({
    pendingInvites: state.pendingInvites.filter(invite => invite.id !== inviteId)
  })),
  
  rejectInvite: (inviteId) => set((state) => ({
    pendingInvites: state.pendingInvites.filter(invite => invite.id !== inviteId)
  }))
}));