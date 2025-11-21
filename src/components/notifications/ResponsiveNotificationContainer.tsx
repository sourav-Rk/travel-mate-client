import React from 'react';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationManager } from './NotificationManager';

interface ResponsiveNotificationContainerProps {
  children: React.ReactNode;
  showBell?: boolean;
  bellVariant?: 'default' | 'minimal' | 'floating';
  bellPosition?: 'header' | 'floating';
  maxNotifications?: number;
  defaultDuration?: number;
}

export const ResponsiveNotificationContainer: React.FC<ResponsiveNotificationContainerProps> = ({
  children,
  showBell = true,
  bellVariant = 'default',
  bellPosition = 'header',
  maxNotifications = 5,
  defaultDuration = 5000
}) => {
  return (
    <NotificationProvider>
      {children}
      
      {/* Notification Manager - Always rendered */}
      <NotificationManager
        maxNotifications={maxNotifications}
        defaultDuration={defaultDuration}
        className="pointer-events-auto"
      />
    </NotificationProvider>
  );
};

























