import { io, Socket } from 'socket.io-client';
import { GameMove, GameType, GameInvite } from '../types/games';
import { User } from '../types';

class GameSocket {
  private socket: Socket | null = null;
  private static instance: GameSocket;

  private constructor() {
    this.connect();
  }

  static getInstance(): GameSocket {
    if (!GameSocket.instance) {
      GameSocket.instance = new GameSocket();
    }
    return GameSocket.instance;
  }

  private connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001/games', {
        autoConnect: true,
        reconnection: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to game server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from game server');
      });
    }
  }

  // Game Actions
  invitePlayer(opponent: User, gameType: GameType) {
    if (!this.socket) return;
    this.socket.emit('send_invite', { opponent, gameType });
  }

  makeMove(move: GameMove) {
    if (!this.socket) return;
    this.socket.emit('game_move', move);
  }

  updatePresence(status: 'online' | 'in-game' | 'offline') {
    if (!this.socket) return;
    this.socket.emit('update_presence', status);
  }

  // Event Listeners
  onGameMove(callback: (move: GameMove) => void) {
    if (!this.socket) return;
    this.socket.on('game_move', callback);
  }

  onGameInvite(callback: (invite: GameInvite) => void) {
    if (!this.socket) return;
    this.socket.on('game_invite', callback);
  }

  onPlayersUpdate(callback: (players: User[]) => void) {
    if (!this.socket) return;
    this.socket.on('players_update', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const gameSocket = GameSocket.getInstance();