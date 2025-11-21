import { useCallback, useEffect, useState } from "react";
import type { GeoPoint } from "@/types/map";

export type UserLocationStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_FALLBACK_LOCATION: GeoPoint = {
  longitude: 76.2673,
  latitude: 9.9312,
};

export const useUserLocation = () => {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [status, setStatus] = useState<UserLocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      setLocation(DEFAULT_FALLBACK_LOCATION);
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });
        setStatus("success");
        setError(null);
      },
      (geoError) => {
        setError(geoError.message);
        setLocation(DEFAULT_FALLBACK_LOCATION);
        setStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location: location ?? DEFAULT_FALLBACK_LOCATION,
    status,
    error,
    requestLocation,
  };
};



