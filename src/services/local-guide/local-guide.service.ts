import { server } from "../server";
import { LOCAL_GUIDE_API } from "@/constants/api/local-guide.api";
import type {
  RequestVerificationRequest,
  RequestVerificationResponse,
  PendingVerificationsResponse,
  VerifyGuideResponse,
  RejectGuideRequest,
  RejectGuideResponse,
  LocalGuideProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/local-guide";


// ================== CLIENT ROUTES ==================

export const requestLocalGuideVerification = async (
  data: RequestVerificationRequest
): Promise<RequestVerificationResponse> => {
  return server.post<RequestVerificationResponse, RequestVerificationRequest>(
    LOCAL_GUIDE_API.REQUEST_VERIFICATION,
    data
  );
};

export const getLocalGuideProfile = async (): Promise<{ success: boolean; profile?: LocalGuideProfile; message?: string }> => {
  return server.get<{ success: boolean; profile?: LocalGuideProfile; message?: string }>(
    LOCAL_GUIDE_API.GET_PROFILE
  );
};

export const updateLocalGuideAvailability = async (data: {
  isAvailable: boolean;
  availabilityNote?: string;
}): Promise<{ success: boolean; message?: string }> => {
  return server.patch<{ success: boolean; message?: string }, { isAvailable: boolean; availabilityNote?: string }>(
    LOCAL_GUIDE_API.UPDATE_AVAILABILITY,
    data
  );
};

export const updateLocalGuideProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  return server.patch<UpdateProfileResponse, UpdateProfileRequest>(
    LOCAL_GUIDE_API.UPDATE_PROFILE,
    data
  );
};

// ================== ADMIN ROUTES ==================

export const getPendingVerifications = async (
  page: number = 1,
  limit: number = 10,
  status: "pending" | "reviewing" | "verified" | "rejected" = "pending",
  searchTerm?: string
): Promise<PendingVerificationsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    status,
  };

  // Only add searchTerm if it's not empty
  if (searchTerm && searchTerm.trim().length > 0) {
    params.searchTerm = searchTerm.trim();
  }

  return server.get<PendingVerificationsResponse>(
    LOCAL_GUIDE_API.GET_PENDING_VERIFICATIONS,
    {
      params,
    }
  );
};

export const verifyLocalGuide = async (
  profileId: string
): Promise<VerifyGuideResponse> => {
  return server.patch<VerifyGuideResponse>(
    LOCAL_GUIDE_API.VERIFY_GUIDE(profileId)
  );
};

export const rejectLocalGuide = async (
  profileId: string,
  data: RejectGuideRequest
): Promise<RejectGuideResponse> => {
  return server.patch<RejectGuideResponse, RejectGuideRequest>(
    LOCAL_GUIDE_API.REJECT_GUIDE(profileId),
    data
  );
};

