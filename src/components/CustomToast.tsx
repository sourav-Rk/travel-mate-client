// CustomToast.tsx
import React from 'react';
import toast from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'login';

// Toast Configuration Interface
interface ToastConfig {
  type: ToastType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

// Base Toast Component
interface CustomToastProps {
  t: Toast;
  config: ToastConfig;
}

const CustomToast: React.FC<CustomToastProps> = ({ t, config }) => {
  const { type, title, description, actionLabel, onAction } = config;

  // Get styles based on toast type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-50 to-emerald-50 border-green-200',
          icon: 'bg-green-100 text-green-600',
          text: 'text-green-900',
          subtext: 'text-green-700',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          closeHover: 'hover:text-green-600 hover:bg-green-100 focus:ring-green-500'
        };
      case 'error':
        return {
          bg: 'from-red-50 to-rose-50 border-red-200',
          icon: 'bg-red-100 text-red-600',
          text: 'text-red-900',
          subtext: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          closeHover: 'hover:text-red-600 hover:bg-red-100 focus:ring-red-500'
        };
      case 'warning':
        return {
          bg: 'from-yellow-50 to-amber-50 border-yellow-200',
          icon: 'bg-yellow-100 text-yellow-600',
          text: 'text-yellow-900',
          subtext: 'text-yellow-700',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          closeHover: 'hover:text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500'
        };
      case 'info':
        return {
          bg: 'from-blue-50 to-cyan-50 border-blue-200',
          icon: 'bg-blue-100 text-blue-600',
          text: 'text-blue-900',
          subtext: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          closeHover: 'hover:text-blue-600 hover:bg-blue-100 focus:ring-blue-500'
        };
      case 'login':
        return {
          bg: 'from-indigo-50 to-purple-50 border-indigo-200',
          icon: 'bg-indigo-100 text-indigo-600',
          text: 'text-indigo-900',
          subtext: 'text-indigo-700',
          button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
          closeHover: 'hover:text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500'
        };
      default:
        return {
          bg: 'from-gray-50 to-slate-50 border-gray-200',
          icon: 'bg-gray-100 text-gray-600',
          text: 'text-gray-900',
          subtext: 'text-gray-700',
          button: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          closeHover: 'hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
        };
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'login':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-gradient-to-r ${styles.bg} border p-4 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-3 transition-all duration-300 hover:shadow-xl`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 ${styles.icon} rounded-full flex items-center justify-center`}>
          {getIcon()}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <p className={`${styles.text} font-medium text-sm`}>{title}</p>
        {description && (
          <p className={`${styles.subtext} text-xs mt-1`}>{description}</p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {actionLabel && onAction && (
          <button 
            onClick={onAction}
            className={`px-3 py-1.5 ${styles.button} text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1`}
          >
            {actionLabel}
          </button>
        )}
        
        <button 
          onClick={() => toast.dismiss(t.id)}
          className={`p-1.5 text-gray-400 ${styles.closeHover} rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Toast Helper Functions
export const showToast = {
  success: (title: string, description?: string, actionLabel?: string, onAction?: () => void) => {
    return toast.custom((t) => (
      <CustomToast 
        t={t} 
        config={{ type: 'success', title, description, actionLabel, onAction }} 
      />
    ), { duration: 4000 });
  },

  error: (title: string, description?: string, actionLabel?: string, onAction?: () => void) => {
    return toast.custom((t) => (
      <CustomToast 
        t={t} 
        config={{ type: 'error', title, description, actionLabel, onAction }} 
      />
    ), { duration: 6000 });
  },

  warning: (title: string, description?: string, actionLabel?: string, onAction?: () => void) => {
    return toast.custom((t) => (
      <CustomToast 
        t={t} 
        config={{ type: 'warning', title, description, actionLabel, onAction }} 
      />
    ), { duration: 5000 });
  },

  info: (title: string, description?: string, actionLabel?: string, onAction?: () => void) => {
    return toast.custom((t) => (
      <CustomToast 
        t={t} 
        config={{ type: 'info', title, description, actionLabel, onAction }} 
      />
    ), { duration: 4000 });
  },

  login: (description?: string) => {
    return toast.custom((t) => (
      <CustomToast 
        t={t} 
        config={{ 
          type: 'login', 
          title: 'Please Login to continue', 
          description: description || 'You need to be signed in to access this feature',
          actionLabel: 'Login',
          onAction: () => {
            // Add your login redirect logic here
            window.location.href = '/login';
          }
        }} 
      />
    ), { duration: 6000 });
  },

  custom: (config: ToastConfig) => {
    return toast.custom((t) => (
      <CustomToast t={t} config={config} />
    ), { duration: config.duration || 4000 });
  }
};

export default CustomToast;
