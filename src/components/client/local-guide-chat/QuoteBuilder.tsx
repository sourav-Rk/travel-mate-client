import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  FileText,
  Search,
  Navigation,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateQuote } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import { getLocalGuideProfile } from "@/services/local-guide/local-guide.service";
import type { CreateQuoteRequest } from "@/types/local-guide-booking";
import { toast } from "react-hot-toast";
import { localToUtcISO } from "@/utils/dateUtils";

interface QuoteBuilderProps {
  guideChatRoomId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type LocationState = {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  state?: string;
  country?: string;
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

export function QuoteBuilder({
  guideChatRoomId,
  onClose,
  onSuccess,
}: QuoteBuilderProps) {
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [hours, setHours] = useState<number>(1);
  const [location, setLocation] = useState<LocationState>({
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [notes, setNotes] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationSearch, setLocationSearch] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { mutateAsync: createQuote, isPending } = useCreateQuote();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getLocalGuideProfile();
        if (response.success && response.profile?.hourlyRate) {
          setHourlyRate(response.profile.hourlyRate);
        } else {
          toast.error("Failed to load hourly rate. Please set it in your profile.");
          onClose();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [onClose]);

  const totalAmount = hourlyRate ? hourlyRate * hours : 0;

  const getCityFromAddress = (address?: NominatimAddress) =>
    address?.city || address?.town || address?.village || address?.hamlet || "";

  const applyLocationResult = (
    result: NominatimResult,
    fallbackAddress?: string
  ) => {
    const parsedLat = parseFloat(result.lat);
    const parsedLon = parseFloat(result.lon);

    setLocation((prev) => ({
      ...prev,
      address: fallbackAddress || result.display_name || prev.address,
      city: getCityFromAddress(result.address) || prev.city,
      state: result.address?.state || prev.state,
      country: result.address?.country || prev.country,
      latitude: Number.isFinite(parsedLat) ? parsedLat : prev.latitude,
      longitude: Number.isFinite(parsedLon) ? parsedLon : prev.longitude,
    }));

    setLocationSearch(result.display_name || fallbackAddress || "");
    setSearchResults([]);
  };

  const searchLocation = async () => {
    if (!locationSearch.trim()) {
      toast.error("Enter a place or address to search");
      return;
    }

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          locationSearch
        )}`
      );
      const data = (await response.json()) as NominatimResult[];

      if (!data.length) {
        toast.error("No locations found. Try a different search.");
      }
      setSearchResults(data);
    } catch (error) {
      console.error("Location search failed", error);
      toast.error("Failed to search locations. Please try again.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectSearchResult = (result: NominatimResult) => {
    applyLocationResult(result);
    toast.success("Location selected");
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latitude}&lon=${longitude}`
    );
    return response.json();
  };

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported in this browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await reverseGeocode(latitude, longitude);
          applyLocationResult(
            {
              display_name: data.display_name || "",
              lat: String(latitude),
              lon: String(longitude),
              address: data.address,
            },
            data.display_name
          );
          toast.success("Current location detected");
        } catch (error) {
          console.error("Reverse geocode failed", error);
          toast.error("Unable to fetch address details");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        toast.error("Unable to access current location");
        setIsDetectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionDate || !sessionTime || !hours || hours <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate session date is in future (using local timezone)
    const selectedDate = new Date(`${sessionDate}T${sessionTime}`);
    if (selectedDate <= new Date()) {
      toast.error("Session date and time must be in the future");
      return;
    }

    // Convert local date/time to UTC ISO string
    const utcSessionDate = localToUtcISO(sessionDate, sessionTime);

    const hasLocationDetails =
      location.address.trim() ||
      location.city.trim() ||
      location.state.trim() ||
      location.country.trim() ||
      typeof location.latitude === "number" ||
      typeof location.longitude === "number";

    const locationPayload = hasLocationDetails
      ? {
          address: location.address.trim() || undefined,
          city: location.city.trim() || undefined,
          state: location.state.trim() || undefined,
          country: location.country.trim() || undefined,
          latitude:
            typeof location.latitude === "number" ? location.latitude : undefined,
          longitude:
            typeof location.longitude === "number" ? location.longitude : undefined,
        }
      : undefined;

    const payload: CreateQuoteRequest = {
      guideChatRoomId,
      sessionDate: utcSessionDate, // UTC ISO string
      sessionTime, // Keep as HH:mm for display
      hours,
      location: locationPayload,
      notes: notes.trim() || undefined,
    };

    try {
      await createQuote(payload);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Create Quote</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Session Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 text-[#8C6A3B]" />
              Session Date *
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
            />
          </div>

          {/* Session Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4 text-[#8C6A3B]" />
              Session Time *
            </label>
            <input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
            />
          </div>

          {/* Hours */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4 text-[#8C6A3B]" />
              Hours *
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
            />
          </div>

          {/* Hourly Rate Display */}
          {hourlyRate && (
            <div className="bg-[#F5F1E8]/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <DollarSign className="w-4 h-4 text-[#8C6A3B]" />
                Hourly Rate
              </div>
              <p className="text-lg font-semibold text-slate-900">
                ₹{hourlyRate.toFixed(2)}/hour
              </p>
            </div>
          )}

          {/* Total Amount */}
          {hourlyRate && (
            <div className="bg-gradient-to-br from-[#C49A6C]/10 to-[#8C6A3B]/10 p-4 rounded-lg border border-[#C49A6C]/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Total Amount</span>
                <span className="text-2xl font-bold text-[#8C6A3B]">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {hours} hour(s) × ₹{hourlyRate.toFixed(2)}
              </p>
            </div>
          )}

          {/* Location (Optional) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-[#8C6A3B]" />
              Meeting Location (Optional)
            </label>

            <div className="rounded-xl border border-slate-200 p-3 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search by place "
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                  />
                 
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={searchLocation}
                    disabled={isSearchingLocation}
                    className={cn(
                      "flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors",
                      isSearchingLocation && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    {isSearchingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={isDetectingLocation}
                    className={cn(
                      "flex items-center justify-center px-4 py-2 rounded-lg border border-teal-500 text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors",
                      isDetectingLocation && "opacity-75 cursor-not-allowed"
                    )}
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Locating...
                      </>
                    ) : (
                      <>
                        <Navigation className="mr-2 h-4 w-4" />
                        Use current
                      </>
                    )}
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                  {searchResults.map((result) => (
                    <button
                      type="button"
                      key={`${result.lat}-${result.lon}`}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 flex items-start gap-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-[#8C6A3B] mt-1" />
                      <span>{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) =>
                    setLocation((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Full address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={location.city}
                    onChange={(e) =>
                      setLocation((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="City"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                  />
                  <input
                    type="text"
                    value={location.state}
                    onChange={(e) =>
                      setLocation((prev) => ({ ...prev, state: e.target.value }))
                    }
                    placeholder="State"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={location.country}
                    onChange={(e) =>
                      setLocation((prev) => ({ ...prev, country: e.target.value }))
                    }
                    placeholder="Country"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={
                        typeof location.latitude === "number"
                          ? String(location.latitude)
                          : ""
                      }
                      onChange={(e) =>
                        setLocation((prev) => ({
                          ...prev,
                          latitude:
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                        }))
                      }
                      placeholder="Latitude"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                    />
                    <input
                      type="number"
                      value={
                        typeof location.longitude === "number"
                          ? String(location.longitude)
                          : ""
                      }
                      onChange={(e) =>
                        setLocation((prev) => ({
                          ...prev,
                          longitude:
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                        }))
                      }
                      placeholder="Longitude"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Provide as much detail as possible to help travellers meet you at
                  the right spot.
                </p>
              </div>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4 text-[#8C6A3B]" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C49A6C] focus:border-[#C49A6C] outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !hourlyRate}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors",
                isPending || !hourlyRate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] hover:from-[#b08256] hover:to-[#7a5a2b]"
              )}
            >
              {isPending ? "Creating..." : "Send Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

