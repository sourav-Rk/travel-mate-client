import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RealTimeNotificationToast } from './RealTimeNotificationToast';
import type { RealTimeNotification } from './RealTimeNotificationToast';

interface NotificationManagerProps {
  maxNotifications?: number;
  defaultDuration?: number;
}

export interface NotificationManagerRef {
  addNotification: (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const NotificationManager = React.forwardRef<NotificationManagerRef, NotificationManagerProps>(
  ({ maxNotifications = 5, defaultDuration = 5000 }, ref) => {
    const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
    const notificationIdCounter = useRef(0);

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
      addNotification: (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
        const id = `notification-${++notificationIdCounter.current}-${Date.now()}`;
        const newNotification: RealTimeNotification = {
          ...notification,
          id,
          timestamp: new Date()
        };

        setNotifications(prev => {
          const updated = [newNotification, ...prev];
          return updated.slice(0, maxNotifications);
        });
      },
      removeNotification: (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      },
      clearAllNotifications: () => {
        setNotifications([]);
      }
    }));

    const handleDismiss = useCallback((id: string) => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);


    useEffect(() => {
      notifications.forEach(notification => {
        const timer = setTimeout(() => {
          handleDismiss(notification.id);
        }, defaultDuration);

        return () => clearTimeout(timer);
      });
    }, [notifications, defaultDuration, handleDismiss]);

    return (
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div className="flex flex-col gap-3 max-w-sm">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                  layout: { duration: 0.3 }
                }}
                style={{
                  zIndex: 9999 - index,
                  pointerEvents: 'auto'
                }}
              >
                <RealTimeNotificationToast
                  notification={notification}
                  onDismiss={handleDismiss}
                  duration={defaultDuration}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

NotificationManager.displayName = 'NotificationManager';

// Hook for easy access to notification manager
export const useNotificationManager = () => {
  const managerRef = useRef<NotificationManagerRef>(null);

  const addNotification = useCallback((notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
    if (managerRef.current) {
      managerRef.current.addNotification(notification);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    if (managerRef.current) {
      managerRef.current.removeNotification(id);
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.clearAllNotifications();
    }
  }, []);

  return {
    managerRef,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};