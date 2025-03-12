import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { gameSocket } from '../services/gameSocket';
import { useAuthStore } from '../store/authStore';
import { GameMove, GameInvite } from '../types/games';

export function useGameInitialization() {
  const { user } = useAuthStore();
  const { 
    setOnlinePlayers, 
    updateGameState, 
    sendInvite,
    updateTicTacToeState,
    updateWordScrambleState,
    updateMemoryState,
    updateQuizState
  } = useGameStore();

  useEffect(() => {
    if (!user) return;

    // Initialize presence
    gameSocket.updatePresence('online');

    // Set up event listeners
    const onPlayersUpdate = (players: any[]) => {
      setOnlinePlayers(players.filter(p => p.id !== user.id));
    };

    const onGameMove = (move: GameMove) => {
      switch (move.gameType) {
        case 'tictactoe':
          updateTicTacToeState(move.value);
          break;
        case 'wordscramble':
          updateWordScrambleState(move.value);
          break;
        case 'memory':
          updateMemoryState(move.value);
          break;
        case 'quiz':
          updateQuizState(move.value);
          break;
      }
    };

    const onGameInvite = (invite: GameInvite) => {
      sendInvite(invite);
    };

    // Register listeners
    gameSocket.onPlayersUpdate(onPlayersUpdate);
    gameSocket.onGameMove(onGameMove);
    gameSocket.onGameInvite(onGameInvite);

    // Cleanup
    return () => {
      gameSocket.updatePresence('offline');
      gameSocket.disconnect();
    };
  }, [user]);
}