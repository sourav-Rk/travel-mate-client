export type BadgeCategory = "service" | "content" | "engagement" | "achievement";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon?: string;
  isEarned: boolean;
}

export interface GuideBadgesResponse {
  earnedBadges: string[];
  allBadges: Badge[];
  totalEarned: number;
  totalAvailable: number;
}





