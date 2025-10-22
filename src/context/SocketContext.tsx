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
    const currentUserId = user?.clientInfo?.id || user?.clientInfo?.role|| null;
    
    console.log(" SocketProvider triggered, user ID:", currentUserId);

    if (currentUserId) {
      const newSocket = connectSocket();
      setSocket(newSocket);

      const unsubscribe = onConnectionChange((connected) => {
        setIsConnected(connected);
        setSocket(getSocket());
      });

      return () => {
        unsubscribe();
      };
    } else {
      disconnectSocket();
      setIsConnected(false);
      setSocket(null);
    }
  }, [user?.clientInfo?.id,user?.clientInfo?.role]); 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};