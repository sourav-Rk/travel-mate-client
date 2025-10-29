import React, { createContext, useContext, useRef } from 'react';
import { useClientAuth } from '@/hooks/auth/useAuth';
import { useRealTimeNotifications } from '@/hooks/notifications/useRealTimeNotifications';
import type { RealTimeNotification } from '@/components/notifications/RealTimeNotificationToast';
import { NotificationManager } from '@/components/notifications/NotificationManager';
import type { NotificationManagerRef } from '@/components/notifications/NotificationManager';

interface NotificationContextType {
  addNotification: (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const user = useClientAuth();
  const userId = user?.clientInfo?.id;
  const notificationManagerRef = useRef<NotificationManagerRef>(null);

  // Handle incoming real-time notifications
  const handleRealTimeNotification = (notification: RealTimeNotification) => {
    if (notificationManagerRef.current?.addNotification) {
      notificationManagerRef.current.addNotification(notification);
    }
  };

  // Set up real-time notifications
  const { isConnected } = useRealTimeNotifications({
    onNotification: handleRealTimeNotification,
    userId
  });

  // Context methods
  const addNotification = (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
    if (notificationManagerRef.current?.addNotification) {
      notificationManagerRef.current.addNotification(notification);
    }
  };

  const removeNotification = (id: string) => {
    if (notificationManagerRef.current?.removeNotification) {
      notificationManagerRef.current.removeNotification(id);
    }
  };

  const clearAllNotifications = () => {
    if (notificationManagerRef.current?.clearAllNotifications) {
      notificationManagerRef.current.clearAllNotifications();
    }
  };

  const contextValue: NotificationContextType = {
    addNotification,
    removeNotification,
    clearAllNotifications,
    isConnected
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* Notification Manager */}
      <NotificationManager 
        ref={notificationManagerRef}
        maxNotifications={5}
        defaultDuration={5000}
      />
    </NotificationContext.Provider>
  );
};

