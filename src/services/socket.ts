import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let connectionListeners: Array<(connected: boolean) => void> = [];
let connectionInProgress = false;

export function connectSocket(): Socket {
  if (connectionInProgress && socket) {
    console.log('Connection already in progress, returning existing socket');
    return socket;
  }

  if (socket && socket.connected) {
    console.log('🔄 Reusing existing connected socket:', socket.id);
    return socket;
  }

  if (socket && !socket.connected) {
    console.log('Previous socket found but disconnected — cleaning up...');
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  console.log('🆕 Creating new socket instance...');
  connectionInProgress = true;

  const SOCKET_URL=import.meta.env.VITE_SOCKET_URL
  
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server:', socket!.id);
    connectionInProgress = false;
    notifyConnectionListeners(true);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from socket server:', reason);
    connectionInProgress = false;
    notifyConnectionListeners(false);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection failed:', error.message);
    connectionInProgress = false;
    notifyConnectionListeners(false);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected to server after', attemptNumber, 'attempts');
    notifyConnectionListeners(true);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection failed:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('💥 All reconnection attempts failed');
    notifyConnectionListeners(false);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    console.log('🔌 Disconnecting socket:', socket.id);
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    connectionInProgress = false;
    notifyConnectionListeners(false);
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function isSocketConnected(): boolean {
  return socket?.connected || false;
}

export function onConnectionChange(callback: (connected: boolean) => void): () => void {
  connectionListeners.push(callback);
  
  return () => {
    connectionListeners = connectionListeners.filter(listener => listener !== callback);
  };
}

function notifyConnectionListeners(connected: boolean): void {
  connectionListeners.forEach(listener => {
    try {
      listener(connected);
    } catch (error) {
      console.error('Error in connection listener:', error);
    }
  });
}