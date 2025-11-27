import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchVolunteerPostsByLocation,
  type PostsLocationSearchPayload,
} from "@/services/map/map.service";

const buildPostQueryKey = (payload: PostsLocationSearchPayload) => [
  "volunteer-posts-location",
  payload.center?.longitude ?? null,
  payload.center?.latitude ?? null,
  payload.radiusInMeters ?? null,
  payload.boundingBox?.north ?? null,
  payload.boundingBox?.south ?? null,
  payload.boundingBox?.east ?? null,
  payload.boundingBox?.west ?? null,
  payload.category ?? null,
  payload.offersGuideService ?? null,
  payload.sortBy ?? null,
  payload.page ?? 1,
  payload.limit ?? 10,
];

export const useVolunteerPostsByLocation = (
  payload: PostsLocationSearchPayload,
  enabled = true
) => {
  const queryKey = useMemo(() => buildPostQueryKey(payload), [payload]);

  return useQuery({
    queryKey,
    queryFn: () => fetchVolunteerPostsByLocation(payload),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};









