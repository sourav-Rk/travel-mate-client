import { travelMateBackend } from "@/api/instance";
import { LOCAL_GUIDE_API } from "@/constants/api/local-guide.api";
import type { IGetLocalGuideBadgesResponse } from "@/types/api/client";
import type { GuideBadgesResponse } from "@/types/badge";

export const getGuideBadges = async (
  guideProfileId: string
): Promise<GuideBadgesResponse> => {
  const response = await travelMateBackend.get<IGetLocalGuideBadgesResponse>(
    LOCAL_GUIDE_API.GET_BADGES(guideProfileId)
  );

  const data = response.data.data || { earnedBadges: [], allBadges: [] };

  return {
    earnedBadges: data.earnedBadges,
    allBadges: data.allBadges,
    totalEarned: data.earnedBadges.length,
    totalAvailable: data.allBadges.length,
  };
};


