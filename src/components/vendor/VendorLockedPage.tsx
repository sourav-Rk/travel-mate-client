import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plane, Hotel, MapPin, Briefcase, BarChart3, DollarSign, Star, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useVendorProfileQuery } from '@/hooks/vendor/useVendorProfile';
import { useLogout } from '@/hooks/auth/useLogout';
import { logoutVendor } from '@/services/auth/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setVendorStatus, vendorLogout } from '@/store/slices/vendor.slice';

// Types
interface VendorProfile {
  _id :string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  agencyName : string;
}

interface StatusConfig {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  message: string;
  progress: number;
  buttonText: string;
  buttonAction: () => void;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const VendorLockedPage: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data, isLoading, error } = useVendorProfileQuery();
  console.log(data?.vendor.status)
  const { mutate: logout } = useLogout(logoutVendor);
  const dispatch = useDispatch();

  useEffect(() =>{
    if(data?.vendor?.status){
           console.log("dispatched")
      dispatch(setVendorStatus(data.vendor.status));
    }
  },[data?.vendor?.status,dispatch])

  const handleLogout = (): void => {
    logout(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatch(vendorLogout());
        navigate("/vendor/login");
      },
      onError: (error: any) => {
        toast.error(error);
      }
    });
  };

  const handleRegistration = (): void => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    navigate("/vendor/signup/step");
  };

  const handleContactSupport = (): void => {
    // You can implement actual contact support logic here
    
  };

  // Get vendor profile data
  const vendorProfile: VendorProfile | null = data?.vendor || null;
  const vendorStatus = vendorProfile?.status || 'pending';

  // Status configurations
  const statusConfigs: Record<string, StatusConfig> = {
    pending: {
      icon: Lock,
      title: "Registration Required",
      message: "Your vendor account is pending verification. Complete the registration process to access your travel partner dashboard and start managing your listings.",
      progress: 25,
      buttonText: "Complete Registration Now",
      buttonAction: handleRegistration,
      iconColor: "from-red-400 to-orange-400",
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600"
    },
    reviewing: {
      icon: Clock,
      title: "Verification in Progress",
      message: "Great! Your registration is complete and our team is currently reviewing your application. You'll receive an email notification once the verification is complete.",
      progress: 90,
      buttonText: "Contact Support",
      buttonAction: handleContactSupport,
      iconColor: "from-yellow-400 to-orange-400",
      gradientFrom: "from-yellow-500",
      gradientTo: "to-orange-600"
    },
    rejected: {
      icon: AlertCircle,
      title: "Application Needs Attention",
      message: "Your application requires some updates. Please review the feedback and resubmit your application with the necessary changes.",
      progress: 50,
      buttonText: "Update Application",
      buttonAction: handleRegistration,
      iconColor: "from-red-400 to-red-600",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-600"
    }
  };

  const currentConfig = statusConfigs[vendorStatus] || statusConfigs.pending;

  const floatingIcons = [
    { Icon: Plane, delay: 0, position: 'top-10 left-10' },
    { Icon: Hotel, delay: 2, position: 'top-20 right-20' },
    { Icon: MapPin, delay: 4, position: 'bottom-20 left-16' },
    { Icon: Briefcase, delay: 6, position: 'bottom-32 right-12' },
  ];

  const features = [
    { Icon: BarChart3, title: 'Analytics Dashboard', description: 'Track your performance' },
    { Icon: Briefcase, title: 'Listing Management', description: 'Manage all your properties' },
    { Icon: DollarSign, title: 'Revenue Tracking', description: 'Monitor your earnings' },
    { Icon: Star, title: 'Premium Support', description: '24/7 dedicated assistance' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-center text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">Unable to load your vendor profile. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getProgressText = (): string => {
    switch (vendorStatus) {
      case 'reviewing':
        return 'Verification Progress: 90% Complete';
      case 'rejected':
        return 'Application Status: Needs Updates';
      default:
        return 'Registration Progress: 25% Complete';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Travel Icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} text-white/20 z-10`}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: delay,
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle size={20} />
            <span>Action completed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-white/20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Status Icon */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-20 h-20 bg-gradient-to-br ${currentConfig.iconColor} rounded-full flex items-center justify-center shadow-xl`}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  '0 0 0 20px rgba(59, 130, 246, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {React.createElement(currentConfig.icon, { className: "text-white", size: 32 })}
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {vendorStatus === 'reviewing' ? 'Verification in Progress' : 'Access Restricted'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-gray-600 text-center mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {vendorStatus === 'reviewing' 
              ? "Your application is being reviewed by our team. We'll notify you once it's complete!"
              : "You're almost there! Complete your vendor registration to unlock exclusive travel partner benefits."
            }
          </motion.p>

          {/* Message Box */}
          <motion.div
            className={`bg-gradient-to-r ${currentConfig.gradientFrom} ${currentConfig.gradientTo} text-white p-6 rounded-2xl mb-8 relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {React.createElement(currentConfig.icon, { size: 20 })}
                {currentConfig.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {currentConfig.message}
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className={`bg-gradient-to-r ${currentConfig.gradientFrom} ${currentConfig.gradientTo} text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto mb-4`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={currentConfig.buttonAction}
            >
              {currentConfig.buttonText}
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
            >
              Logout
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <feature.Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <motion.div
            className="w-full bg-blue-100 rounded-full h-3 mb-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${currentConfig.gradientFrom} ${currentConfig.gradientTo} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: `${currentConfig.progress}%` }}
              transition={{ duration: 2, delay: 1.6 }}
            />
          </motion.div>

          <motion.p
            className="text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {getProgressText()}
          </motion.p>

         
        </motion.div>
      </div>
    </div>
  );
};

export default VendorLockedPage;


 {/* Additional Info */}
          // <motion.div
          //   className="mt-8 text-center"
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          //   transition={{ delay: 2 }}
          // >
          //   <p className="text-sm text-gray-500 mb-2">
          //     Need help? Contact our support team
          //   </p>
          //   <motion.button
          //     className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
          //     whileHover={{ scale: 1.05 }}
          //     onClick={() => window.open('mailto:support@travelsite.com')}
          //   >
          //     support@travelsite.com
          //   </motion.button>
          // </div>