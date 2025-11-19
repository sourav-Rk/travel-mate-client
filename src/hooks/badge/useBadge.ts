import { useQuery } from "@tanstack/react-query";
import {  getGuideBadges } from "@/services/badge/badge.service";
import type {  GuideBadgesResponse } from "@/types/badge";

// export const useAllBadges = () => {
//   return useQuery<Badge[]>({
//     queryKey: ["all-badges"],
//     queryFn: getAllBadges,
//   });
// };

export const useGuideBadges = (guideProfileId: string, enabled: boolean = true) => {
  const isEnabled = enabled && !!guideProfileId && guideProfileId.trim() !== "";
  
  return useQuery<GuideBadgesResponse>({
    queryKey: ["guide-badges", guideProfileId || "none"],
    queryFn: () => {
      if (!guideProfileId || guideProfileId.trim() === "") {
        throw new Error("guideProfileId is required");
      }
      return getGuideBadges(guideProfileId);
    },
    enabled: isEnabled,
  });
 };

// export const useEvaluateBadges = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: (guideProfileId: string) => evaluateBadges(guideProfileId),
//     onSuccess: (_, guideProfileId) => {
//       queryClient.invalidateQueries({ queryKey: ["guide-badges", guideProfileId] });
//     },
//   });
// }
