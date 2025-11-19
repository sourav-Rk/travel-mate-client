
"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BadgeCard } from "./BadgeCard";
import { BadgeIcon } from "./BadgeIcon";
import { cn } from "@/lib/utils";
import { BadgeTooltip } from "./BadgeTooltip";
import type { Badge } from "@/types/badge";

interface BadgeDisplayProps {
  badges: Array<Badge & { priority?: number }>;
  maxDisplay?: number;
  showAll?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  compact?: boolean;
  showFilters?: boolean;
  title?: string;
}

type FilterType = "all" | "earned" | "locked" | "service" | "content" | "engagement" | "achievement";

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "earned", label: "Earned" },
  { value: "locked", label: "Locked" },
  { value: "service", label: "Service" },
  { value: "content", label: "Content" },
  { value: "engagement", label: "Engagement" },
  { value: "achievement", label: "Achievement" },
];

export function BadgeDisplay({
  badges,
  maxDisplay = 6,
  showAll = false,
  size = "md",
  className,
  compact = false,
  showFilters = false,
  title = "Achievement Badges",
}: BadgeDisplayProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showMore, setShowMore] = useState(showAll);

  const sortedBadges = useMemo(() => {
    return [...badges].sort((a, b) => {
      if (a.isEarned !== b.isEarned) {
        return a.isEarned ? -1 : 1;
      }
      const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
      const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [badges]);

  const earnedBadges = sortedBadges.filter((b) => b.isEarned);
  const earnedCount = earnedBadges.length;
  const lockedCount = sortedBadges.length - earnedCount;

  const filteredBadges = sortedBadges.filter((badge) => {
    if (filter === "all") return true;
    if (filter === "earned") return badge.isEarned;
    if (filter === "locked") return !badge.isEarned;
    return badge.category === filter;
  });

  const displayBadges =
    showAll || showMore ? filteredBadges : filteredBadges.slice(0, maxDisplay);
  const remainingCount = Math.max(filteredBadges.length - maxDisplay, 0);
  const canToggleView = !showAll && filteredBadges.length > maxDisplay;

  const gridClassName =
    size === "sm"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  if (sortedBadges.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-slate-500">No badges available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Badges ({earnedCount})
          </h3>
          {!showAll && remainingCount > 0 && (
            <span className="text-sm text-slate-600">+{remainingCount} more</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {displayBadges.map((badge) => (
            <BadgeTooltip key={badge.id} badge={badge}>
              <div className="cursor-pointer">
                <BadgeIcon
                  icon={badge.icon || "⭐"}
                  isEarned={badge.isEarned}
                  size={size}
                  animated={true}
                />
              </div>
            </BadgeTooltip>
          ))}
          {!showAll && remainingCount > 0 && (
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white text-sm font-bold shadow-md">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-600 to-cyan-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Unlock badges by completing services and engaging with the community
        </p>
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <motion.div
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            {earnedCount} Earned
          </motion.div>
          <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-semibold">
            {lockedCount} Locked
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all duration-300",
                filter === option.value
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Badge Grid */}
      {displayBadges.length > 0 ? (
        <div className={gridClassName}>
          {displayBadges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} size={size} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-500"
        >
          <p className="text-lg">No badges found for this filter</p>
          <p className="text-sm mt-2">Try selecting a different category</p>
        </motion.div>
      )}

      {canToggleView && (
        <div className="text-center">
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-green-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore
              ? "Show Less"
              : `View ${remainingCount} More Badge${remainingCount !== 1 ? "s" : ""}`}
          </motion.button>
        </div>
      )}
    </div>
  );
}