import { AlertTriangle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type : string;
  isLoading : boolean;
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning", // warning, danger, success, info
  isLoading = false 
} : ConfirmationModalProps) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: XCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          confirmBg: 'bg-green-600 hover:bg-green-700',
          borderColor: 'border-green-200'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          confirmBg: 'bg-amber-600 hover:bg-amber-700',
          borderColor: 'border-amber-200'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white/10 backdrop-blur-xs backdrop-saturate-150 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className={`mx-auto w-16 h-16 ${config.bgColor} ${config.borderColor} border-2 rounded-full flex items-center justify-center mb-6`}>
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 text-white ${config.confirmBg} rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Loading...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal


