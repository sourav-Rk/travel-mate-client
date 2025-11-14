import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestLocalGuideVerification,
  getPendingVerifications,
  verifyLocalGuide,
  rejectLocalGuide,
  getLocalGuideProfile,
  updateLocalGuideAvailability,
  updateLocalGuideProfile,
} from "@/services/local-guide/local-guide.service";
import type {
  RequestVerificationRequest,
  RejectGuideRequest,
  UpdateProfileRequest,
} from "@/types/local-guide";

// ================== CLIENT HOOKS ==================

export const useRequestVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RequestVerificationRequest) =>
      requestLocalGuideVerification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      queryClient.invalidateQueries({ queryKey: ["local-guide-profile"] });
    },
  });
};

export const useLocalGuideProfileQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["local-guide-profile"],
    queryFn: async () => {
      try {
        const response = await getLocalGuideProfile();
        if (!response.success || !response.profile) {
          return null;
        }
        return response.profile;
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    enabled,
    throwOnError: false,
  });
};

export const useUpdateLocalGuideAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { isAvailable: boolean; availabilityNote?: string }) =>
      updateLocalGuideAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local-guide-profile"] });
    },
  });
};

export const useUpdateLocalGuideProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateLocalGuideProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local-guide-profile"] });
    },
  });
};

// ================== ADMIN HOOKS ==================

export const usePendingVerifications = (
  page: number = 1,
  limit: number = 10,
  status: "pending" | "reviewing" | "verified" | "rejected" = "pending",
  enabled: boolean = true,
  searchTerm?: string
) => {
  // Normalize search term - use undefined for empty strings
  const normalizedSearchTerm = searchTerm && searchTerm.trim().length > 0 
    ? searchTerm.trim() 
    : undefined;

  return useQuery({
    queryKey: ["pending-verifications", page, limit, status, normalizedSearchTerm],
    queryFn: () => getPendingVerifications(page, limit, status, normalizedSearchTerm),
    enabled,
  });
};

export const useVerifyLocalGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => verifyLocalGuide(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-verifications"],
      });
    },
  });
};

export const useRejectLocalGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      profileId,
      data,
    }: {
      profileId: string;
      data: RejectGuideRequest;
    }) => rejectLocalGuide(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-verifications"],
      });
    },
  });
};

