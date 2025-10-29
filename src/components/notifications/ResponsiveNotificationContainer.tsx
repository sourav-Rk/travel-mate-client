import React from 'react';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationManager } from './NotificationManager';
import { NotificationBell } from './NotificationBell';

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

      {/* Notification Bell - Conditional rendering */}
      {showBell && (
        <>
          {bellPosition === 'floating' ? (
            <NotificationBell
              variant="floating"
              className="pointer-events-auto"
            />
          ) : (
            <div className="fixed top-4 right-4 z-40 pointer-events-auto">
              <NotificationBell
                variant={bellVariant}
                showPermissionHandler={true}
              />
            </div>
          )}
        </>
      )}
    </NotificationProvider>
  );
};



