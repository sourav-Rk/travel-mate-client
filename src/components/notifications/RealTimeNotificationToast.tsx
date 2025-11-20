import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, MessageCircle, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationSound } from '@/hooks/notifications/useNotificationSound';

export interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'message' | 'booking' | 'payment';
  timestamp: Date;
}

interface RealTimeNotificationToastProps {
  notification: RealTimeNotification;
  onDismiss: (id: string) => void;
  duration?: number;
}

const getNotificationIcon = (type: RealTimeNotification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'message':
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case 'booking':
      return <Calendar className="w-5 h-5 text-purple-500" />;
    case 'payment':
      return <CreditCard className="w-5 h-5 text-indigo-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const getNotificationColors = (type: RealTimeNotification['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'bg-green-500',
        text: 'text-green-800',
        iconBg: 'bg-green-100'
      };
    case 'error':
      return {
        bg: 'from-red-50 to-rose-50',
        border: 'border-red-200',
        accent: 'bg-red-500',
        text: 'text-red-800',
        iconBg: 'bg-red-100'
      };
    case 'warning':
      return {
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
        accent: 'bg-yellow-500',
        text: 'text-yellow-800',
        iconBg: 'bg-yellow-100'
      };
    case 'message':
      return {
         bg: 'from-gray-50 to-slate-50',
        border: 'border-gray-200',
        accent: 'bg-gray-500',
        text: 'text-gray-800',
        iconBg: 'bg-gray-100'
      };
    case 'booking':
      return {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'bg-purple-500',
        text: 'text-purple-800',
        iconBg: 'bg-purple-100'
      };
    case 'payment':
      return {
        bg: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        accent: 'bg-indigo-500',
        text: 'text-indigo-800',
        iconBg: 'bg-indigo-100'
      };
    default:
      return {
        bg: 'from-gray-50 to-slate-50',
        border: 'border-gray-200',
        accent: 'bg-gray-500',
        text: 'text-gray-800',
        iconBg: 'bg-gray-100'
      };
  }
};

export const RealTimeNotificationToast: React.FC<RealTimeNotificationToastProps> = ({
  notification,
  onDismiss,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { playNotificationSound } = useNotificationSound();
  const colors = getNotificationColors(notification.type);

  useEffect(() => {
    // Play sound when notification appears
    playNotificationSound({ volume: 0.4 });

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, playNotificationSound]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <AnimatePresence onExitComplete={() => onDismiss(notification.id)}>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          className={`max-w-sm w-full bg-gradient-to-br ${colors.bg} ${colors.border} border shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden backdrop-blur-xl relative`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Animated accent bar */}
          <motion.div
            className={`absolute left-0 top-0 h-full w-1 ${colors.accent} shadow-lg`}
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                `0 0 10px ${colors.accent}40`,
                `0 0 20px ${colors.accent}60`,
                `0 0 10px ${colors.accent}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content area */}
          <div className="flex flex-col flex-1 p-4 relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-8 h-8 ${colors.iconBg} rounded-full flex items-center justify-center`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </motion.div>
                <div>
                  <h4 className={`font-semibold text-sm ${colors.text}`}>
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-sm ${colors.text} leading-relaxed`}
            >
              {notification.message}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            >
              <motion.div
                className={`h-full ${colors.accent} rounded-full`}
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* Floating particles effect */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${colors.accent} rounded-full opacity-40`}
              style={{
                top: `${30 + i * 30}%`,
                right: `${15 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};























