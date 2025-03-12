export class WebSocketBase {
  protected ws: WebSocket | null = null;
  protected messageHandlers: Map<string, (data: any) => void> = new Map();
  protected url: string;
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 5;
  protected reconnectDelay = 5000;

  constructor(path: string) {
    this.url = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}${path}`;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onopen = this.handleOpen.bind(this);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = this.parseMessage(event.data);
      if (!data) return;

      this.messageHandlers.forEach(handler => {
        try {
          handler(data);
        } catch (err) {
          console.error('Error in message handler:', err);
        }
      });
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }

  private parseMessage(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      console.error('Invalid message format');
      return null;
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
  }

  private handleClose() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    console.log('WebSocket connected');
  }

  onMessage(id: string, handler: (data: any) => void) {
    this.messageHandlers.set(id, handler);
    return () => {
      this.messageHandlers.delete(id);
    };
  }

  send(data: any) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected');
      return;
    }

    try {
      const serializedData = this.serializeMessage(data);
      if (serializedData) {
        this.ws.send(serializedData);
      }
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
    }
  }

  private serializeMessage(data: any): string | null {
    try {
      // Remove non-serializable values
      const cleanData = JSON.parse(JSON.stringify(data));
      return JSON.stringify(cleanData);
    } catch {
      console.error('Failed to serialize message');
      return null;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }
}