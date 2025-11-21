import type { GeoPoint } from "@/types/map";

const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface GeocodingResponse {
  features: GeocodingFeature[];
}

export const geocodePlace = async (
  query: string,
  token: string
): Promise<Array<{ label: string; coordinates: GeoPoint }>> => {
  const url = new URL(`${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("limit", "5");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch location suggestions");
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.features || []).map((feature) => ({
    label: feature.place_name,
    coordinates: {
      longitude: feature.center[0],
      latitude: feature.center[1],
    },
  }));
};




