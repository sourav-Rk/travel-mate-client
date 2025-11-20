import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";

import type {
  GeoPoint,
  GuideLayerFeature,
  MapLayerType,
  VolunteerPostLayerFeature,
} from "@/types/map";

interface MapMarkersLayerProps {
  mapInstance: mapboxgl.Map | null;
  guideFeatures: GeoJSON.FeatureCollection<GeoJSON.Point, GuideLayerFeature>;
  postFeatures: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    VolunteerPostLayerFeature
  >;
  activeLayer: MapLayerType;
  userLocation: GeoPoint;
}

const createMarkerElement = (
  layer: MapLayerType,
  feature: GuideLayerFeature | VolunteerPostLayerFeature
) => {
  const el = document.createElement("div");
  
  // Main container with enhanced styling
  el.style.width = "48px";
  el.style.height = "48px";
  el.style.position = "relative";
  el.style.cursor = "pointer";
  
  // Outer glow ring (static)
  const glowRing = document.createElement("div");
  glowRing.style.position = "absolute";
  glowRing.style.top = "-4px";
  glowRing.style.left = "-4px";
  glowRing.style.width = "56px";
  glowRing.style.height = "56px";
  glowRing.style.borderRadius = "50%";
  glowRing.style.background = layer === "localGuides" 
    ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)";
  
  // Main marker circle
  const marker = document.createElement("div");
  marker.style.position = "absolute";
  marker.style.top = "4px";
  marker.style.left = "4px";
  marker.style.width = "40px";
  marker.style.height = "40px";
  marker.style.borderRadius = "50%";
  marker.style.background = layer === "localGuides"
    ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
    : "linear-gradient(135deg, #22c55e 0%, #fbbf24 100%)";
  marker.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3), 0 0 0 4px white, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)";
  marker.style.display = "flex";
  marker.style.alignItems = "center";
  marker.style.justifyContent = "center";
  
  // Icon element
  const icon = document.createElement("div");
  icon.style.fontSize = "20px";
  icon.style.filter = "drop-shadow(0 2px 3px rgba(0,0,0,0.4))";
  
  if (feature.kind === "guide") {
    icon.innerHTML = "👤";
  } else {
    icon.innerHTML = "🤝";
  }
  
  marker.appendChild(icon);
  el.appendChild(glowRing);
  el.appendChild(marker);
  
  return el;
};

const createPopupContent = (
  feature: GuideLayerFeature | VolunteerPostLayerFeature,
  navigate: (path: string) => void
) => {
  const container = document.createElement("div");
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";
  container.style.borderRadius = "12px";
  container.style.overflow = "hidden";
  container.style.cursor = "pointer";

  if (feature.kind === "guide") {
    const guide = feature.guide;
    const name =
      guide.userDetails?.firstName || guide.profileImage
        ? `${guide.userDetails?.firstName ?? ""} ${
            guide.userDetails?.lastName ?? ""
          }`.trim()
        : "Local Guide";
    
    const profileImage = guide.userDetails?.profileImage || guide.profileImage;
    const hasImage = !!profileImage;
    
    container.innerHTML = `
      <div id="guide-details-${guide._id}" style="cursor:pointer;transition:all 0.2s ease;">
        <div style="background:linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);padding:16px;margin:-12px -16px 0 -16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${hasImage 
              ? `<img id="guide-profile-image-${guide._id}" src="${profileImage}" alt="${name}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2);cursor:pointer;transition:transform 0.2s ease;" />`
              : `<div id="guide-profile-image-${guide._id}" style="width:56px;height:56px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:28px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2);cursor:pointer;transition:transform 0.2s ease;">👤</div>`
            }
            <div style="flex:1;">
              <div style="font-weight:700;color:white;font-size:17px;margin-bottom:4px;text-shadow:0 2px 4px rgba(0,0,0,0.2);">
                ${name}
              </div>
              <div style="font-size:13px;color:rgba(255,255,255,0.95);display:flex;align-items:center;gap:4px;">
                <span>📍</span>
                ${guide.location.city}, ${guide.location.state}
              </div>
            </div>
          </div>
        </div>
        <div style="padding:16px;background:white;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:6px;background:#eff6ff;padding:6px 12px;border-radius:20px;">
              <span style="font-size:14px;">⭐</span>
              <span style="font-size:14px;font-weight:600;color:#0369a1;">
                ${guide.stats.averageRating.toFixed(1)}
              </span>
              <span style="font-size:12px;color:#64748b;">
                (${guide.stats.totalRatings})
              </span>
            </div>
            ${guide.isAvailable 
              ? `<div style="background:#dcfce7;color:#16a34a;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;">Available</div>`
              : `<div style="background:#fee2e2;color:#dc2626;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;">Busy</div>`
            }
          </div>
          <div style="background:#f0fdf4;border-left:3px solid #22c55e;padding:12px;border-radius:6px;margin-bottom:12px;">
            <div style="font-size:20px;font-weight:700;color:#16a34a;margin-bottom:2px;">
              ₹${guide.hourlyRate}<span style="font-size:13px;font-weight:500;color:#64748b;">/hour</span>
            </div>
          </div>
          ${guide.specialties.length > 0 
            ? `<div style="margin-top:12px;">
                <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Specialties</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${guide.specialties.slice(0, 3).map(specialty => 
                    `<span style="background:#f1f5f9;color:#475569;font-size:12px;padding:4px 10px;border-radius:12px;font-weight:500;">${specialty}</span>`
                  ).join('')}
                </div>
              </div>`
            : ''
          }
          ${guide.languages.length > 0 
            ? `<div style="margin-top:12px;">
                <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Languages</div>
                <div style="font-size:13px;color:#475569;">
                  ${guide.languages.slice(0, 3).join(" • ")}
                </div>
              </div>`
            : ''
          }
          <div style="margin-top:16px;padding:8px;background:#f8fafc;border-radius:8px;text-align:center;">
            <div style="font-size:12px;color:#64748b;font-weight:600;">
              Click anywhere to view full profile →
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    const post = feature?.post;
    const hasImages = post.images && post.images.length > 0;

    const firstImage = post.images?.[0] || "";
    const imagesCount = post.images?.length || 0;
    
    container.innerHTML = `
      <div style="background:linear-gradient(135deg, #22c55e 0%, #fbbf24 100%);padding:16px;margin:-12px -16px 0 -16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:56px;height:56px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:28px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2);">🤝</div>
          <div style="flex:1;">
            <div style="font-weight:700;color:white;font-size:17px;text-shadow:0 2px 4px rgba(0,0,0,0.2);">
              ${post.title}
            </div>
          </div>
        </div>
      </div>
      ${hasImages 
        ? `<div style="margin:-12px -16px 0 -16px;position:relative;">
            <img id="post-image-${post._id}" src="${firstImage}" alt="${post.title}" style="width:100%;height:160px;object-fit:cover;cursor:pointer;transition:transform 0.2s ease;" />
            ${imagesCount> 1 
              ? `<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.7);color:white;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;backdrop-filter:blur(4px);">
                  +${imagesCount - 1} more
                </div>`
              : ''
            }
          </div>`
        : ''
      }
      <div style="padding:16px;background:white;">
        <div style="font-size:13px;color:#475569;line-height:1.6;margin-bottom:12px;">
          ${post.description.slice(0, 100)}${post.description.length > 100 ? "…" : ""}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:inline-block;font-size:12px;color:#7c3aed;font-weight:600;background:#f3e8ff;padding:6px 12px;border-radius:16px;border:1px solid #e9d5ff;">
            ${post.category}
          </div>
          <div style="display:flex;align-items:center;gap:12px;font-size:12px;color:#64748b;">
            <span style="display:flex;align-items:center;gap:4px;">
              ❤️ ${post.likes}
            </span>
            <span style="display:flex;align-items:center;gap:4px;">
              👁️ ${post.views}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  container.addEventListener("click", (event) => {
    event.stopPropagation();
    if (feature.kind === "guide") {
      navigate(`/local-guide/details/${feature.guide._id}`);
    } else {
      navigate(`/volunteer-posts/${feature.post._id}`);
    }
  });

  return container;
};

export const MapMarkersLayer = ({
  mapInstance,
  guideFeatures,
  postFeatures,
  activeLayer,
  userLocation,
}: MapMarkersLayerProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapInstance) return;

    // Simple check for map readiness
    const isMapReady = mapInstance.getContainer() && mapInstance.loaded();
    
    if (!isMapReady) {
      console.warn('Map not ready for markers');
      return;
    }

    const markers: mapboxgl.Marker[] = [];
    const features =
      activeLayer === "localGuides"
        ? guideFeatures.features
        : postFeatures.features;

    features.forEach((feature) => {
      if (feature.geometry.type !== "Point") return;
      
      const [longitude, latitude] = feature.geometry.coordinates;
      const markerEl = createMarkerElement(activeLayer, feature.properties);
      const popupContent = createPopupContent(feature.properties, navigate);
      
      const popup = new mapboxgl.Popup({ 
        offset: 20,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "300px"
      }).setDOMContent(popupContent);

      // Use try-catch for each marker creation
      try {
        const marker = new mapboxgl.Marker({
          element: markerEl
        })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(mapInstance);

        markers.push(marker);
      } catch (error) {
        console.warn('Failed to create marker:', error);
      }
    });

    // User location marker
    try {
      const userMarker = new mapboxgl.Marker({
        color: "#0ea5e9",
        scale: 0.9,
      })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<div style="font-weight:600;color:#0f172a;font-size:14px;">You are here</div>`
          )
        )
        .addTo(mapInstance);

      markers.push(userMarker);
    } catch (error) {
      console.warn('Failed to create user marker:', error);
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [mapInstance, guideFeatures, postFeatures, activeLayer, userLocation, navigate]);

  return null;
};