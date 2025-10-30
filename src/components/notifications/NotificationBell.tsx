import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationPermissionHandler } from './NotificationPermissionHandler';
import { NotificationManager } from './NotificationManager';
import { useNotificationContext } from '@/context/NotificationContext';

interface NotificationBellProps {
  className?: string;
  showPermissionHandler?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = "",
  showPermissionHandler = true,
  size = 'md',
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const { isConnected } = useNotificationContext();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Simulate notification count (you can replace this with actual count from your state)
  useEffect(() => {
    // This would typically come from your notification state
    // For now, we'll simulate it
    const interval = setInterval(() => {
      if (isConnected) {
        setNotificationCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNotifications}
          className={`${sizeClasses[size]} rounded-full hover:bg-gray-100 transition-colors`}
        >
          <Bell className={`${iconSizes[size]} text-gray-600`} />
          {notificationCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </motion.div>
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            onClick={toggleNotifications}
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg border-0`}
          >
            <Bell className={`${iconSizes[size]}`} />
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </motion.div>
            )}
          </Button>
          
          {/* Connection status indicator */}
          <motion.div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={{
              scale: isConnected ? [1, 1.2, 1] : 1,
              opacity: isConnected ? [1, 0.7, 1] : 0.5
            }}
            transition={{
              duration: 2,
              repeat: isConnected ? Infinity : 0
            }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main notification bell */}
      <div className="flex items-center gap-2">
        {/* Permission Handler */}
        {showPermissionHandler && (
          <NotificationPermissionHandler className="hidden sm:block" />
        )}

        {/* Sound Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          className={`${sizeClasses[size]} rounded-full transition-colors ${
            isSoundEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          {isSoundEnabled ? <Volume2 className={iconSizes[size]} /> : <VolumeX className={iconSizes[size]} />}
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotifications}
            className={`${sizeClasses[size]} rounded-full hover:bg-gray-100 transition-colors`}
          >
            <Bell className={`${iconSizes[size]} text-gray-600`} />
          </Button>

          {/* Notification Badge */}
          {notificationCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </motion.div>
          )}

          {/* Connection Status */}
          <motion.div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={{
              scale: isConnected ? [1, 1.2, 1] : 1,
              opacity: isConnected ? [1, 0.7, 1] : 0.5
            }}
            transition={{
              duration: 2,
              repeat: isConnected ? Infinity : 0
            }}
          />
        </div>
      </div>

      {/* Notification Manager */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <NotificationManager
              maxNotifications={5}
              defaultDuration={5000}
              className="shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Permission Handler */}
      {showPermissionHandler && (
        <div className="sm:hidden mt-2">
          <NotificationPermissionHandler />
        </div>
      )}
    </div>
  );
};




