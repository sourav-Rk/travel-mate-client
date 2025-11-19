"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BadgeIconProps {
  icon: string;
  isEarned: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: { container: "w-10 h-10", text: "text-2xl" },
  md: { container: "w-20 h-20", text: "text-4xl" },
  lg: { container: "w-28 h-28", text: "text-5xl" },
};

interface IconStyle {
  from: string;
  to: string;
  glow: string;
}

const iconStyles: Record<string, IconStyle> = {
  "🎯": { from: "#ef4444", to: "#f97316", glow: "rgba(239, 68, 68, 0.6)" },
  "⭐": { from: "#facc15", to: "#f59e0b", glow: "rgba(250, 204, 21, 0.6)" },
  "🌟": { from: "#fde047", to: "#eab308", glow: "rgba(253, 224, 71, 0.6)" },
  "🏆": { from: "#f59e0b", to: "#ea580c", glow: "rgba(245, 158, 11, 0.6)" },
  "👑": { from: "#a855f7", to: "#ec4899", glow: "rgba(168, 85, 247, 0.6)" },
  "💎": { from: "#60a5fa", to: "#06b6d4", glow: "rgba(96, 165, 250, 0.6)" },
  "✨": { from: "#f472b6", to: "#fb7185", glow: "rgba(244, 114, 182, 0.6)" },
  "🛡️": { from: "#6366f1", to: "#2563eb", glow: "rgba(99, 102, 241, 0.6)" },
  "📝": { from: "#94a3b8", to: "#475569", glow: "rgba(148, 163, 184, 0.6)" },
  "📸": { from: "#c084fc", to: "#ec4899", glow: "rgba(192, 132, 252, 0.6)" },
  "📷": { from: "#3b82f6", to: "#4f46e5", glow: "rgba(59, 130, 246, 0.6)" },
  "📚": { from: "#10b981", to: "#059669", glow: "rgba(16, 185, 129, 0.6)" },
  "🎨": { from: "#8b5cf6", to: "#9333ea", glow: "rgba(139, 92, 246, 0.6)" },
  "❤️": { from: "#f87171", to: "#ec4899", glow: "rgba(248, 113, 113, 0.6)" },
  "🔥": { from: "#f97316", to: "#dc2626", glow: "rgba(249, 115, 22, 0.6)" },
  "💖": { from: "#ec4899", to: "#f43f5e", glow: "rgba(236, 72, 153, 0.6)" },
  "👀": { from: "#22d3ee", to: "#3b82f6", glow: "rgba(34, 211, 238, 0.6)" },
  "👁️": { from: "#2dd4bf", to: "#06b6d4", glow: "rgba(45, 212, 191, 0.6)" },
  "🚀": { from: "#6366f1", to: "#9333ea", glow: "rgba(99, 102, 241, 0.6)" },
  "💯": { from: "#10b981", to: "#16a34a", glow: "rgba(16, 185, 129, 0.6)" },
  "📈": { from: "#3b82f6", to: "#06b6d4", glow: "rgba(59, 130, 246, 0.6)" },
  "🏅": { from: "#d97706", to: "#eab308", glow: "rgba(217, 119, 6, 0.6)" },
};

export function BadgeIcon({
  icon,
  isEarned,
  size = "md",
  className,
  animated = true,
}: BadgeIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const style = iconStyles[icon] || {
    from: "#9ca3af",
    to: "#6b7280",
    glow: "rgba(156, 163, 175, 0.6)",
  };
  const sizeClass = sizeClasses[size];

  const baseClasses = cn(
    "relative rounded-full flex items-center justify-center transition-all duration-300",
    sizeClass.container,
    isEarned ? "shadow-2xl" : "bg-gray-200 grayscale opacity-60",
    className
  );

  if (!animated || !isEarned) {
    return (
      <div
        className={baseClasses}
        style={
          isEarned
            ? {
                background: `linear-gradient(135deg, ${style.from}, ${style.to})`,
                boxShadow: `0 10px 40px ${style.glow}`,
              }
            : undefined
        }
      >
        <span className={cn("select-none", sizeClass.text)}>{icon}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="relative"
      animate={{
        rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={baseClasses}
        style={{
          background: `linear-gradient(135deg, ${style.from}, ${style.to})`,
          boxShadow: `0 10px 40px ${style.glow}, 0 0 20px ${style.glow}`,
        }}
      >
        <motion.span
          className={cn("select-none", sizeClass.text)}
          animate={
            isHovered
              ? {
                  scale: [1, 1.2, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(255,255,255,0))",
                    "drop-shadow(0 0 10px rgba(255,255,255,1))",
                    "drop-shadow(0 0 0px rgba(255,255,255,0))",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
        >
          {icon}
        </motion.span>

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            boxShadow: `0 0 20px ${style.glow}`,
          }}
        />
      </div>

      {/* Pulse ring effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            border: `2px solid ${style.from}`,
          }}
        />
      )}

      {/* Sparkle particles */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + Math.cos((i * Math.PI) / 3) * 150}%`,
                  y: `${50 + Math.sin((i * Math.PI) / 3) * 150}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}