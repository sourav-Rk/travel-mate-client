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


//----------------ADMIN BADGE DTO----------------

export interface BadgeCriteria {
  type: string;
  value: number;
  additionalCondition?: {
    type: string;
    value: number;
  };
}

export interface BadgeDto {
  id: string;
  badgeId: string;
  name: string;
  description: string;
  category: "service" | "content" | "engagement" | "achievement";
  icon?: string;
  criteria: BadgeCriteria[];
  priority?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBadgePayload {
  badgeId: string;
  name: string;
  description: string;
  category: "service" | "content" | "engagement" | "achievement";
  icon?: string;
  criteria: BadgeCriteria[];
  priority?: number;
}

export interface UpdateBadgePayload {
  name?: string;
  description?: string;
  category?: "service" | "content" | "engagement" | "achievement";
  icon?: string;
  criteria?: BadgeCriteria[];
  priority?: number;
  isActive?: boolean;
}

export interface GetBadgesFilters {
  isActive?: boolean;
  category?: "service" | "content" | "engagement" | "achievement";
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBadgesResponse {
  success: boolean;
  badges: BadgeDto[];
  currentPage: number;
  totalPages: number;
  message?: string;
}






