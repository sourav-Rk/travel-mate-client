// context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  connectSocket, 
  disconnectSocket, 
  getSocket, 
  onConnectionChange 
} from '@/services/socket';
import { useClientAuth } from '../hooks/auth/useAuth';

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useClientAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(getSocket());

  useEffect(() => {
    const currentUserId = user?.clientInfo?.id || null;
    
    console.log("🔄 SocketProvider triggered, user ID:", currentUserId);

    if (currentUserId) {
      console.log("👤 User detected, connecting socket...");
      const newSocket = connectSocket();
      setSocket(newSocket);

      // Subscribe to connection state changes
      const unsubscribe = onConnectionChange((connected) => {
        setIsConnected(connected);
        setSocket(getSocket());
      });

      return () => {
        console.log(" Cleaning up SocketProvider...");
        unsubscribe();
        // Don't disconnect here - let the auth logic handle it
      };
    } else {
      console.log("👤 No user, disconnecting socket");
      disconnectSocket();
      setIsConnected(false);
      setSocket(null);
    }
  }, [user?.clientInfo?.id]); // Only depend on user ID

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};