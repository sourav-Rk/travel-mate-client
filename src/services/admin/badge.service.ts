import { ADMIN_API } from "@/constants/api/admin.api";
import type { IResponse } from "@/types/Response";
import { server } from "../server";
import type {
  BadgeDto,
  CreateBadgePayload,
  GetBadgesFilters,
  PaginatedBadgesResponse,
  UpdateBadgePayload,
} from "@/types/badge";

export const badgeService = {
  getAllBadges: async (filters?: GetBadgesFilters) =>
    server.get<PaginatedBadgesResponse>(ADMIN_API.GET_ALL_BADGES, {
      params: filters,
    }),

  getBadgeById: async (badgeId: string) =>
    server.get<{ success: true; badge: BadgeDto }>(
      ADMIN_API.GET_BADGE_BY_ID(badgeId)
    ),

  createBadge: async (payload: CreateBadgePayload) =>
    server.post<IResponse>(ADMIN_API.CREATE_BADGE, payload),

  updateBadge: async (badgeId: string, payload: UpdateBadgePayload) =>
    server.post<IResponse>(ADMIN_API.UPDATE_BADGE(badgeId), payload),

  deleteBadge: async (badgeId: string) =>
    server.delete<IResponse>(ADMIN_API.DELETE_BADGE(badgeId)),

  toggleBadgeStatus: async (badgeId: string, isActive: boolean) =>
    server.put<IResponse>(ADMIN_API.UPDATE_BADGE(badgeId), { isActive }),
};
