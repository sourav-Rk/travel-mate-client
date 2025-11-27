// types/badge.ts
import type { Badge } from "@/types/badge";

export const BADGE_DEFINITIONS: Record<string, Omit<Badge, "isEarned">> = {
  /**
   * SERVICE BADGES
   */
  first_service: {
    id: "first_service",
    name: "First Service",
    description: "Complete your first booking",
    category: "service",
    icon: "🎯",
  },
  service_5: {
    id: "service_5",
    name: "Service Starter",
    description: "Complete 5 bookings",
    category: "service",
    icon: "⭐",
  },
  service_10: {
    id: "service_10",
    name: "Service Provider",
    description: "Complete 10 bookings",
    category: "service",
    icon: "🌟",
  },
  service_25: {
    id: "service_25",
    name: "Experienced Guide",
    description: "Complete 25 bookings",
    category: "service",
    icon: "🏆",
  },
  service_50: {
    id: "service_50",
    name: "Veteran Guide",
    description: "Complete 50 bookings",
    category: "service",
    icon: "👑",
  },
  service_100: {
    id: "service_100",
    name: "Master Guide",
    description: "Complete 100 bookings",
    category: "service",
    icon: "💎",
  },
  perfect_rating: {
    id: "perfect_rating",
    name: "Perfect Service",
    description: "Maintain a 5.0 average rating with 10+ reviews",
    category: "service",
    icon: "✨",
  },
  reliable_guide: {
    id: "reliable_guide",
    name: "Reliable Guide",
    description: "Maintain 95%+ completion rate with 20+ services",
    category: "service",
    icon: "🛡️",
  },

  /**
   * CONTENT BADGES
   */
  first_post: {
    id: "first_post",
    name: "First Post",
    description: "Create your first post",
    category: "content",
    icon: "📝",
  },
  posts_5: {
    id: "posts_5",
    name: "Content Creator",
    description: "Create 5 posts",
    category: "content",
    icon: "📸",
  },
  posts_10: {
    id: "posts_10",
    name: "Active Poster",
    description: "Create 10 posts",
    category: "content",
    icon: "📷",
  },
  posts_25: {
    id: "posts_25",
    name: "Community Contributor",
    description: "Create 25 posts",
    category: "content",
    icon: "📚",
  },
  posts_50: {
    id: "posts_50",
    name: "Content Master",
    description: "Create 50 posts",
    category: "content",
    icon: "🎨",
  },

  /**
   * ENGAGEMENT BADGES
   */
  likes_100: {
    id: "likes_100",
    name: "Like Magnet",
    description: "Receive 100 total likes across all posts",
    category: "engagement",
    icon: "❤️",
  },
  likes_500: {
    id: "likes_500",
    name: "Popular Guide",
    description: "Receive 500 total likes",
    category: "engagement",
    icon: "🔥",
  },
  likes_1000: {
    id: "likes_1000",
    name: "Community Favorite",
    description: "Receive 1000 total likes",
    category: "engagement",
    icon: "💖",
  },

  views_10: {
    id: "views_10",
    name: "View Starter",
    description: "Receive 10 total views",
    category: "engagement",
    icon: "👀",
  },
  views_1000: {
    id: "views_1000",
    name: "View Master",
    description: "Receive 1000 total views",
    category: "engagement",
    icon: "👁️",
  },
  views_10000: {
    id: "views_10000",
    name: "Viral Guide",
    description: "Receive 10000 total views",
    category: "engagement",
    icon: "🚀",
  },

  post_likes_100: {
    id: "post_likes_100",
    name: "Popular Post",
    description: "Single post with 100+ likes",
    category: "engagement",
    icon: "💯",
  },
  post_views_1000: {
    id: "post_views_1000",
    name: "Viral Post",
    description: "Single post with 1000+ views",
    category: "engagement",
    icon: "📈",
  },

  /**
   * ACHIEVEMENT BADGES
   */
  rising_star: {
    id: "rising_star",
    name: "Rising Star",
    description: "Complete 10 services and create 5 posts in your first month",
    category: "achievement",
    icon: "⭐",
  },
  community_leader: {
    id: "community_leader",
    name: "Community Leader",
    description: "Create 50+ posts and receive 1000+ total likes",
    category: "achievement",
    icon: "👑",
  },
  service_expert: {
    id: "service_expert",
    name: "Service Expert",
    description: "Complete 100+ services with 4.5+ average rating",
    category: "achievement",
    icon: "🏅",
  },
};


export function mapBadgeIdsToBadges(
  badgeIds: string[],
  allBadgeIds?: string[]
): Badge[] {
  const earnedSet = new Set(badgeIds);
  const allSet = allBadgeIds
    ? new Set(allBadgeIds)
    : new Set(Object.keys(BADGE_DEFINITIONS));

  return Array.from(allSet).map((badgeId) => {
    const definition = BADGE_DEFINITIONS[badgeId];

    // Fallback for unknown badge IDs
    if (!definition) {
      return {
        id: badgeId,
        name: badgeId
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        description: `Badge: ${badgeId}`,
        category: "achievement",
        icon: "⭐",
        isEarned: earnedSet.has(badgeId),
      };
    }

    // Badge exists in definitions
    return {
      ...definition,
      isEarned: earnedSet.has(badgeId),
    };
  });
}


/**
 * Get all badge definitions
 */
export function getAllBadgeDefinitions(): Badge[] {
  return Object.values(BADGE_DEFINITIONS).map((def) => ({
    ...def,
    isEarned: false,
  }));
}












