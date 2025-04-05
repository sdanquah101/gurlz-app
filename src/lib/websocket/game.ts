import { WebSocketBase } from './base';

class GameWebSocket extends WebSocketBase {
  constructor() {
    super('/games');
  }
}

export const gameWebSocket = new GameWebSocket();