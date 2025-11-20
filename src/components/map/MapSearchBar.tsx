import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, RefreshCw } from "lucide-react";

import { geocodePlace } from "@/services/map/geocoding.service";
import { mapboxConfig } from "@/config/mapbox.config";
import type { GeoPoint } from "@/types/map";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface MapSearchBarProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  onPlaceSelect: (place: { label: string; coordinates: GeoPoint }) => void;
  onResetCenter: () => void;
  isDisabled?: boolean;
}

interface Suggestion {
  label: string;
  coordinates: GeoPoint;
}

const MIN_RADIUS = 1000;
const MAX_RADIUS = 50000;

export const MapSearchBar = ({
  radius,
  onRadiusChange,
  onPlaceSelect,
  onResetCenter,
  isDisabled,
}: MapSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localRadius, setLocalRadius] = useState(radius);

  // Sync localRadius with prop when it changes externally
  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  // Debounce radius changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localRadius !== radius) {
        onRadiusChange(localRadius);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [localRadius, radius, onRadiusChange]);

  useEffect(() => {
    if (!query || query.length < 3 || !mapboxConfig.accessToken) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const results = await geocodePlace(query, mapboxConfig.accessToken!);
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to fetch places");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const radiusLabel = useMemo(
    () => `${Math.round(localRadius / 100) / 10} km`,
    [localRadius]
  );

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, landmark or place"
            className="h-12 rounded-2xl pr-12"
            disabled={isDisabled || !mapboxConfig.accessToken}
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-5 w-5" />}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full rounded-2xl border border-neutral-200 bg-white shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                  onClick={() => {
                    onPlaceSelect(suggestion);
                    setQuery(suggestion.label);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="w-full lg:w-80">
          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Search radius ({radiusLabel})
          </label>
          <Slider
            min={MIN_RADIUS}
            max={MAX_RADIUS}
            step={500}
            value={[localRadius]}
            onValueChange={([value]) => setLocalRadius(value ?? MIN_RADIUS)}
            className="mt-3"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-2xl lg:w-auto"
          onClick={() => {
            onResetCenter();
            setQuery("");
            setSuggestions([]);
          }}
          disabled={isDisabled}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to my location
        </Button>
      </div>
    </div>
  );
};

