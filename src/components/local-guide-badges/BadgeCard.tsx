"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BadgeIcon } from "./BadgeIcon";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types/badge";

interface BadgeCardProps {
  badge: Badge;
  index?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type SizeConfig = {
  cardPadding: string;
  spacing: string;
  title: string;
  description: string;
  category: string;
  minHeight: string;
};

const sizeConfigs: Record<NonNullable<BadgeCardProps["size"]>, SizeConfig> = {
  sm: {
    cardPadding: "p-4",
    spacing: "space-y-3",
    title: "text-base",
    description: "text-xs",
    category: "px-2.5 py-0.5 text-[11px]",
    minHeight: "min-h-[220px]",
  },
  md: {
    cardPadding: "p-5",
    spacing: "space-y-4",
    title: "text-lg",
    description: "text-sm",
    category: "px-3 py-1 text-xs",
    minHeight: "min-h-[260px]",
  },
  lg: {
    cardPadding: "p-6",
    spacing: "space-y-5",
    title: "text-xl",
    description: "text-base",
    category: "px-4 py-1.5 text-sm",
    minHeight: "min-h-[300px]",
  },
};

interface CategoryStyle {
  bg: string;
  border: string;
  text: string;
}

const categoryColors: Record<string, CategoryStyle> = {
  service: {
    bg: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600",
  },
  content: {
    bg: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/30",
    text: "text-purple-600",
  },
  engagement: {
    bg: "from-rose-500/10 to-orange-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600",
  },
  achievement: {
    bg: "from-amber-500/10 to-yellow-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600",
  },
};

const iconStyles: Record<string, { from: string; to: string; glow: string }> = {
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

export function BadgeCard({ badge, index = 0, size = "md", className }: BadgeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const style = iconStyles[badge.icon!] || iconStyles["⭐"];
  const categoryStyle = categoryColors[badge.category] || categoryColors.service;
  const sizeConfig = sizeConfigs[size];

  return (
    <motion.div
      className={cn("group relative h-full", className)}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-xl backdrop-blur-xl border transition-all duration-500 h-full",
          sizeConfig.cardPadding,
          sizeConfig.minHeight,
          badge.isEarned
            ? `bg-gradient-to-br ${categoryStyle.bg} ${categoryStyle.border} shadow-lg hover:shadow-2xl`
            : "bg-gray-100/50 border-gray-200 opacity-60"
        )}
      >
        {/* Animated background gradient */}
        {badge.isEarned && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${style.glow}, transparent 70%)`,
            }}
          />
        )}

        {/* Sparkle effect */}
        <AnimatePresence>
          {badge.isEarned && isHovered && (
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
                    x: `${50 + Math.cos((i * Math.PI) / 3) * 100}%`,
                    y: `${50 + Math.sin((i * Math.PI) / 3) * 100}%`,
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

        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col items-center text-center w-full",
            sizeConfig.spacing
          )}
        >
          {/* Badge Icon */}
          <BadgeIcon icon={badge.icon!} isEarned={badge.isEarned} size={size} animated={true} />

          {/* Badge Info */}
          <div className="space-y-2 flex-1 w-full">
            <h3
              className={cn(
                "font-bold",
                sizeConfig.title,
                badge.isEarned ? "text-gray-900" : "text-gray-500"
              )}
            >
              {badge.name}
            </h3>
            <p
              className={cn(
                "leading-relaxed",
                sizeConfig.description,
                badge.isEarned ? "text-gray-600" : "text-gray-400"
              )}
            >
              {badge.description}
            </p>
          </div>

          {/* Category tag */}
          <motion.div
            className={cn(
              "rounded-full font-semibold border",
              sizeConfig.category,
              badge.isEarned
                ? `${categoryStyle.text} ${categoryStyle.border} bg-white/50`
                : "text-gray-400 border-gray-300 bg-gray-50"
            )}
            whileHover={badge.isEarned ? { scale: 1.05 } : {}}
          >
            {badge.category}
          </motion.div>

          {/* Lock icon for unearned badges */}
          {!badge.isEarned && (
            <motion.div
              className="absolute top-4 right-4 text-gray-400 text-xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🔒
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}