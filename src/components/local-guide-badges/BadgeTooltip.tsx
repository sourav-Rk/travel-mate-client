"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types/badge";

interface BadgeTooltipProps {
  badge: Badge;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
  left: "right-full top-1/2 -translate-y-1/2 mr-3",
  right: "left-full top-1/2 -translate-y-1/2 ml-3",
};

const arrowClasses = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
  right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",
};

const categoryEmojis: Record<Badge["category"], string> = {
  service: "🎯",
  content: "📝",
  engagement: "❤️",
  achievement: "🏆",
};

export function BadgeTooltip({
  badge,
  children,
  className,
  position = "top",
}: BadgeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 pointer-events-none",
              positionClasses[position]
            )}
          >
            {/* Tooltip content */}
            <div className="bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden min-w-[280px] max-w-[320px]">
              {/* Header with gradient */}
              <div
                className={cn(
                  "px-4 py-3 bg-gradient-to-r",
                  badge.isEarned
                    ? "from-blue-600 to-purple-600"
                    : "from-gray-700 to-gray-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon || "⭐"}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-base leading-tight">
                      {badge.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-90">
                        {categoryEmojis[badge.category]} {badge.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-4 py-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  {badge.description}
                </p>
              </div>

              {/* Status badge */}
              <div className="px-4 pb-3">
                {badge.isEarned ? (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">Earned</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <span className="text-gray-400 font-semibold">Locked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div
              className={cn(
                "absolute w-0 h-0 border-8",
                arrowClasses[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}