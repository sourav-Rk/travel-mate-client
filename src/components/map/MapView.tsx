import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { mapboxConfig } from "@/config/mapbox.config";
import type { GeoPoint } from "@/types/map";

mapboxgl.accessToken = mapboxConfig.accessToken ?? "";

export interface MapViewProps {
  center: GeoPoint;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  onReady?: (map: mapboxgl.Map) => void;
  onBoundsChange?: (bounds: mapboxgl.LngLatBounds | null) => void;
  onMapInstance?: (map: mapboxgl.Map | null) => void;
  children?: React.ReactNode;
}

export const MapView = ({
  center,
  zoom = mapboxConfig.defaultZoom,
  minZoom = mapboxConfig.minZoom,
  maxZoom = mapboxConfig.maxZoom,
  className,
  onReady,
  onBoundsChange,
  onMapInstance,
  children,
}: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const boundsListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapboxConfig.defaultStyle,
      center: [center.longitude, center.latitude],
      zoom,
      minZoom,
      maxZoom,
    });

    mapRef.current = map;
    onMapInstance?.(map);

    map.on("load", () => {
      onReady?.(map);
      onBoundsChange?.(map.getBounds());
      onMapInstance?.(map);
    });

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      onBoundsChange?.(bounds);
    };
    map.on("moveend", handleMoveEnd);
    boundsListenerRef.current = () => map.off("moveend", handleMoveEnd);

    return () => {
      boundsListenerRef.current?.();
      map.remove();
      mapRef.current = null;
      onMapInstance?.(null);
    };
  }, [
    center.latitude,
    center.longitude,
    maxZoom,
    minZoom,
    onBoundsChange,
    onReady,
    onMapInstance,
    zoom,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.flyTo({
      center: [center.longitude, center.latitude],
      essential: true,
      zoom,
    });
  }, [center.latitude, center.longitude, zoom]);

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      <div ref={containerRef} className="h-full w-full rounded-2xl" />
      {children}
    </div>
  );
};

