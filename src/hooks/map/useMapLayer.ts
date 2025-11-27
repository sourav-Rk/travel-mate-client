import { useCallback, useState } from "react";
import type { MapLayerType } from "@/types/map";

export const useMapLayer = (initialLayer: MapLayerType = "volunteerPosts") => {
  const [layer, setLayer] = useState<MapLayerType>(initialLayer);

  const toggleLayer = useCallback((nextLayer: MapLayerType) => {
    setLayer(nextLayer);
  }, []);

  return { layer, toggleLayer };
};










