import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types';

class ChatService {
  private socket: Socket;
  private static instance: ChatService;

  private constructor() {
    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001');
    this.setupListeners();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  joinRoom(roomId: string) {
    this.socket.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leave_room', roomId);
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    this.socket.emit('send_message', message);
  }

  onNewMessage(callback: (message: ChatMessage) => void) {
    this.socket.on('new_message', callback);
  }

  onUserTyping(callback: (data: { username: string; roomId: string }) => void) {
    this.socket.on('user_typing', callback);
  }

  emitTyping(roomId: string, username: string) {
    this.socket.emit('typing', { roomId, username });
  }
}