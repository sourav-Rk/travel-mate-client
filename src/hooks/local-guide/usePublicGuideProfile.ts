import { useQuery } from "@tanstack/react-query";

import { getLocalGuidePublicProfile } from "@/services/local-guide/local-guide.service";

export const usePublicGuideProfile = (
  profileId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["public-guide-profile", profileId],
    queryFn: () => getLocalGuidePublicProfile(profileId),
    enabled: enabled && Boolean(profileId),
  });
};










