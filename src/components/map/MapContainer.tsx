import { useCallback, useMemo, useState } from "react";
import { MapView } from "./MapView";
import { MapControls } from "./MapControls";
import { MapToggle } from "./MapToggle";
import { MapSearchBar } from "./MapSearchBar";
import { MapBoundingBoxControls } from "./MapBoundingBoxControls";
import { MapResultsSidebar } from "./MapResultsSidebar";
import { MapMarkersLayer } from "./MapMarkersLayer";
import { useUserLocation } from "@/hooks/map/useUserLocation";
import { useMapLayer } from "@/hooks/map/useMapLayer";
import { useGuidesByLocation } from "@/hooks/map/useGuidesByLocation";
import { useVolunteerPostsByLocation } from "@/hooks/map/useVolunteerPostsByLocation";
import type {
  BoundingBox,
  GeoPoint,
  GuideLayerFeature,
  VolunteerPostLayerFeature,
} from "@/types/map";
import { mapboxConfig } from "@/config/mapbox.config";

const DEFAULT_RADIUS = 10000;

const boundsToBox = (
  bounds: mapboxgl.LngLatBounds | null
): BoundingBox | undefined => {
  if (!bounds) return undefined;
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
  };
};

export const MapContainer = () => {
  const { location, status, requestLocation } = useUserLocation();
  const { layer, toggleLayer } = useMapLayer();
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();
  const [radiusInMeters, setRadiusInMeters] = useState(DEFAULT_RADIUS);
  const [manualCenter, setManualCenter] = useState<GeoPoint | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const center = manualCenter ?? location;

  const searchPayload = useMemo(
    () => ({
      center,
      radiusInMeters,
      boundingBox,
      page: 1,
      limit: 20,
    }),
    [boundingBox, center, radiusInMeters]
  );

  const guidesQuery = useGuidesByLocation(
    searchPayload,
    layer === "localGuides"
  );
  const postsQuery = useVolunteerPostsByLocation(
    searchPayload,
    layer === "volunteerPosts"
  );

  const activeQuery = layer === "localGuides" ? guidesQuery : postsQuery;
  const guideItems = useMemo(
    () => guidesQuery.data?.items ?? [],
    [guidesQuery.data]
  );
  const postItems = useMemo(
    () => postsQuery.data?.items ?? [],
    [postsQuery.data]
  );
  const activeItems = layer === "localGuides" ? guideItems : postItems;

  const guideFeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: guideItems.map((guide) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: guide.location.coordinates,
        },
        properties: {
          kind: "guide",
          guide,
        } as GuideLayerFeature,
      })),
    }),
    [guideItems]
  );

  const postFeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: postItems.map((post) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: post.location.coordinates,
        },
        properties: {
          kind: "post",
          post,
        } as VolunteerPostLayerFeature,
      })),
    }),
    [postItems]
  );

  const handleMapReady = useCallback((map: mapboxgl.Map) => {
    const bounds = map.getBounds();
    if (bounds) setBoundingBox(boundsToBox(bounds));
  }, []);

  const handleBoundsChange = useCallback((bounds: mapboxgl.LngLatBounds | null) => {
    setBoundingBox(boundsToBox(bounds));
  }, []);

  const handleZoomIn = useCallback(() => mapInstance?.zoomIn(), [mapInstance]);
  const handleZoomOut = useCallback(
    () => mapInstance?.zoomOut(),
    [mapInstance]
  );
  const handleLocate = useCallback(() => {
    requestLocation();
    setManualCenter(null);
    if (!mapInstance) return;
    mapInstance.flyTo({
      center: [location.longitude, location.latitude],
      essential: true,
      zoom: mapInstance.getZoom(),
    });
  }, [location.latitude, location.longitude, mapInstance, requestLocation]);

  const handlePlaceSelect = useCallback(
    (place: { label: string; coordinates: GeoPoint }) => {
      setManualCenter(place.coordinates);
      setBoundingBox(undefined);
      mapInstance?.flyTo({
        center: [place.coordinates.longitude, place.coordinates.latitude],
        zoom: Math.max(mapInstance?.getZoom() ?? mapboxConfig.defaultZoom, 12),
        essential: true,
      });
    },
    [mapInstance]
  );

  const handleResetCenter = useCallback(() => {
    setManualCenter(null);
    setBoundingBox(undefined);
    if (!mapInstance) return;
    mapInstance.flyTo({
      center: [location.longitude, location.latitude],
      zoom: mapInstance.getZoom(),
      essential: true,
    });
  }, [location.longitude, location.latitude, mapInstance]);

  const handleUseCurrentView = useCallback(() => {
    if (!mapInstance) return;
    const bounds = mapInstance.getBounds()
    setBoundingBox(boundsToBox(bounds));
  }, [mapInstance]);

  const handleClearBoundingBox = useCallback(() => {
    setBoundingBox(undefined);
  }, []);

  const handleRetry = useCallback(() => {
    void activeQuery.refetch();
  }, [activeQuery]);

  if (!mapboxConfig.accessToken) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-lg font-semibold text-neutral-800">
          Mapbox token missing
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Add{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5">
            VITE_MAPBOX_ACCESS_TOKEN
          </code>{" "}
          to your environment to enable the interactive map experience.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <MapSearchBar
        radius={radiusInMeters}
        onRadiusChange={setRadiusInMeters}
        onPlaceSelect={handlePlaceSelect}
        onResetCenter={handleResetCenter}
        isDisabled={status === "loading"}
      />
      <MapBoundingBoxControls
        onUseCurrentView={handleUseCurrentView}
        onClear={handleClearBoundingBox}
        hasBoundingBox={Boolean(boundingBox)}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="relative h-[520px] rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <MapView
            center={center}
            onReady={handleMapReady}
            onBoundsChange={handleBoundsChange}
            className="rounded-3xl"
            onMapInstance={setMapInstance}
          >
            <MapToggle layer={layer} onChange={toggleLayer} />
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onLocate={handleLocate}
              isLocateDisabled={status === "loading"}
            />
            {activeQuery.isError && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-[90%] max-w-2xl -translate-x-1/2 rounded-2xl bg-white/90 p-4 text-center text-sm font-medium text-red-500 shadow-lg backdrop-blur">
                Failed to load map data
              </div>
            )}
          </MapView>
          <MapMarkersLayer
            mapInstance={mapInstance}
            guideFeatures={guideFeatureCollection}
            postFeatures={postFeatureCollection}
            activeLayer={layer}
            userLocation={location}
          />
        </div>
        <MapResultsSidebar
          layer={layer}
          items={activeItems}
          isLoading={activeQuery.isLoading}
          isError={Boolean(activeQuery.isError)}
          onRetry={handleRetry}
        />
      </div>
    </section>
  );
};
