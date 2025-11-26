import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  badgeService,
  type CreateBadgePayload,
  type GetBadgesFilters,
  type UpdateBadgePayload,
  type PaginatedBadgesResponse,
} from "@/services/admin/badge.service";

const BADGES_QUERY_KEY = ["admin", "badges"];

export const useBadges = (filters?: GetBadgesFilters) => {
  return useQuery<PaginatedBadgesResponse>({
    queryKey: [...BADGES_QUERY_KEY, filters],
    queryFn: () => badgeService.getAllBadges(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBadge = (badgeId: string) => {
  return useQuery({
    queryKey: [...BADGES_QUERY_KEY, badgeId],
    queryFn: () => badgeService.getBadgeById(badgeId),
    enabled: !!badgeId,
  });
};

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateBadgePayload) => badgeService.createBadge(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast.success(response.message);
      navigate("/admin/ad_pvt/badges");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create badge";
      toast.error(message);
    },
  });
};

export const useUpdateBadge = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ badgeId, payload }: { badgeId: string; payload: UpdateBadgePayload }) =>
      badgeService.updateBadge(badgeId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast.success(response.message || "Badge updated successfully");
      navigate("/admin/ad_pvt/badges");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update badge";
      toast.error(message);
    },
  });
};

export const useDeleteBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (badgeId: string) => badgeService.deleteBadge(badgeId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast.success(response.message||"Badge deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete badge";
      toast.error(message);
    },
  });
};

export const useToggleBadgeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ badgeId, isActive }: { badgeId: string; isActive: boolean }) =>
      badgeService.toggleBadgeStatus(badgeId, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast.success(`Badge ${variables.isActive ? "activated" : "deactivated"} successfully`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to toggle badge status";
      toast.error(message);
    },
  });
};

