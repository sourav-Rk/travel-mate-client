"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface KnowMoreButtonProps {
  vendorId?: string;
  packageId?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function KnowMoreButton({ 
  vendorId, 
  packageId, 
  className = "",
  variant = "default" 
}: KnowMoreButtonProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (vendorId && packageId) {
      navigate(`/pvt/vendor-chat/${vendorId}/${packageId}`);
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        <Button
          onClick={handleClick}
          variant="outline"
          className="w-full border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium group"
          size="lg"
        >
          <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Ask Questions
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleClick}
        className={`
          relative w-full group
          bg-gradient-to-r from-blue-600 to-purple-600 
          hover:from-blue-700 hover:to-purple-700
          text-white font-semibold
          border-0 shadow-lg hover:shadow-xl
          transition-all duration-300
          h-14
        `}
        size="lg"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? [-5, 5, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Want to know more?</span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
}