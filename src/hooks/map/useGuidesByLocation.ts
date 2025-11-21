import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGuidesByLocation,
  type GuidesLocationSearchPayload,
} from "@/services/map/map.service";

const buildQueryKey = (payload: GuidesLocationSearchPayload) => [
  "guides-location",
  payload.center?.longitude ?? null,
  payload.center?.latitude ?? null,
  payload.radiusInMeters ?? null,
  payload.boundingBox?.north ?? null,
  payload.boundingBox?.south ?? null,
  payload.boundingBox?.east ?? null,
  payload.boundingBox?.west ?? null,
  payload.specialties?.join(",") ?? null,
  payload.isAvailable ?? null,
  payload.minRating ?? null,
  payload.page ?? 1,
  payload.limit ?? 10,
];

export const useGuidesByLocation = (
  payload: GuidesLocationSearchPayload,
  enabled = true
) => {
  const queryKey = useMemo(() => buildQueryKey(payload), [payload]);

  return useQuery({
    queryKey,
    queryFn: () => fetchGuidesByLocation(payload),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};



