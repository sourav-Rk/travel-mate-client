export const MAPBOX_STYLE_LIGHT =
  "mapbox://styles/mapbox/streets-v12";
export const MAPBOX_STYLE_DARK =
  "mapbox://styles/mapbox/dark-v11";

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    "[Mapbox] Missing VITE_MAPBOX_ACCESS_TOKEN. Map features will be disabled."
  );
}

export const mapboxConfig = {
  accessToken,
  defaultZoom: 12,
  minZoom: 2,
  maxZoom: 18,
  defaultStyle: MAPBOX_STYLE_LIGHT,
  darkStyle: MAPBOX_STYLE_DARK,
};

export type MapboxConfig = typeof mapboxConfig;


