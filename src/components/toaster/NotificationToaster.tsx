import { toast } from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationToastProps {
  t: Toast;
  title: string;
  body: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ t, title, body }) => {
  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          initial={{ x: 300, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
          className="max-w-sm w-full bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30 border border-white/70 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 p-0 overflow-hidden backdrop-blur-xl relative"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div 
            className="absolute inset-0 opacity-50"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
                "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glowing accent bar */}
          <motion.div 
            className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-lg"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                "0 0 10px rgba(147, 51, 234, 0.4)",
                "0 0 20px rgba(147, 51, 234, 0.6)",
                "0 0 10px rgba(147, 51, 234, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Content area */}
          <div className="flex flex-col flex-1 p-6 relative z-10">
            {/* Floating notification icon */}
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                y: [0, -4, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            <motion.strong 
              className="text-gray-800 text-sm font-semibold mb-2 tracking-wide"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            >
              {title}
            </motion.strong>
            
            <motion.span 
              className="text-gray-600 text-sm leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              {body}
            </motion.span>
          </div>
          
          {/* Action area */}
          <div className="flex border-l border-white/30 backdrop-blur-sm bg-gradient-to-b from-white/20 to-white/10 relative">
            {/* Subtle glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border-0 rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 relative z-10 group overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(59, 130, 246, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.span 
                className="relative z-10"
                whileHover={{
                  textShadow: "0 0 8px rgba(147, 51, 234, 0.5)"
                }}
              >
                Close
              </motion.span>
              
              {/* Animated hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-r-2xl"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{
                  opacity: [0, 1, 0],
                  scale: [0, 4, 0],
                  x: [0, 10, -10, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.button>
          </div>
          
          {/* Floating particles effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"
              style={{
                top: `${20 + i * 20}%`,
                right: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
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