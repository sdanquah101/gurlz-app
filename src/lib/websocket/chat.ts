export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];

  constructor(private url: string = import.meta.env.VITE_WS_URL || 'ws://localhost:3001') {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(data));
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const chatWebSocket = new ChatWebSocket();