import { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import type { RealTimeNotification } from '@/components/notifications/RealTimeNotificationToast';

interface SocketNotificationData {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'message' | 'booking' | 'payment';
  userId?: string;
  timestamp?: string;
}

interface UseRealTimeNotificationsProps {
  onNotification?: (notification: RealTimeNotification) => void;
  userId?: string;
}

export const useRealTimeNotifications = ({ 
  onNotification, 
  userId 
}: UseRealTimeNotificationsProps = {}) => {
  const { socket, isConnected } = useSocket();
  const notificationCallbackRef = useRef(onNotification);

  useEffect(() => {
    notificationCallbackRef.current = onNotification;
  }, [onNotification]);


  const convertSocketNotification = useCallback((data: SocketNotificationData): RealTimeNotification => {
    return {
      id: data.id || `socket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    };
  }, []);

  const handleNotification = useCallback((data: SocketNotificationData) => {
    console.log("new notification recieved")
    if (userId && data.userId && data.userId !== userId) {
      return;
    }
    const notification = convertSocketNotification(data);
    if (notificationCallbackRef.current) {
      notificationCallbackRef.current(notification);
    }
  }, [userId, convertSocketNotification]);

  // Handle different types of notifications
  const handleBookingNotification = useCallback((data: any) => {
    handleNotification({
      ...data,
      type: 'booking'
    });
  }, [handleNotification]);

  const handleMessageNotification = useCallback((data: any) => {
    handleNotification({
      ...data,
      type: 'message'
    });
  }, [handleNotification]);

  const handlePaymentNotification = useCallback((data: any) => {
    handleNotification({
      ...data,
      type: 'payment'
    });
  }, [handleNotification]);

  const handleErrorNotification = useCallback((data: any) => {
    handleNotification({
      ...data,
      type: 'error'
    });
  }, [handleNotification]);

  const handleSuccessNotification = useCallback((data: any) => {
    handleNotification({
      ...data,
      type: 'success'
    });
  }, [handleNotification]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('Setting up real-time notification listeners');


    socket.on('new_notification',handleNotification)

    // Cleanup listeners
    return () => {
      console.log('Cleaning up real-time notification listeners');
      socket.off('new_notification',handleNotification)
    };
  }, [
    socket, 
    isConnected, 
    userId, 
    handleNotification, 
    handleBookingNotification, 
    handleMessageNotification, 
    handlePaymentNotification, 
    handleErrorNotification, 
    handleSuccessNotification
  ]);

  // Send notification acknowledgment (optional)
  const acknowledgeNotification = useCallback((notificationId: string) => {
    if (socket && isConnected) {
      socket.emit('notification-acknowledged', { notificationId });
    }
  }, [socket, isConnected]);


  return {
    isConnected,
    acknowledgeNotification,
  };
};































