"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Info,
  Send,
  Loader2,
  Navigation,
  Crosshair,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import axios from "axios";
interface CoordinatesDto {
  lat: number;
  lng: number;
}

interface LocationDto {
  name: string;
  address: string;
  coordinates: CoordinatesDto;
}

interface CreateInstructionDto {
  packageId: string;
  title: string;
  message: string;
  type: 'MEETING_POINT' | 'ITINERARY_UPDATE' | 'SAFETY_INFO' | 'REMINDER' | 'GENERAL';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  location?: LocationDto;
}

interface CreateInstructionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  isPending : boolean;
  onSubmit: (data: CreateInstructionDto) => void
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
}

const instructionTypes = [
  { value: 'MEETING_POINT', label: 'Meeting Point', icon: MapPin, color: 'text-blue-600' },
  { value: 'ITINERARY_UPDATE', label: 'Itinerary Update', icon: Calendar, color: 'text-purple-600' },
  { value: 'SAFETY_INFO', label: 'Safety Information', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'REMINDER', label: 'Reminder', icon: Info, color: 'text-orange-600' },
  { value: 'GENERAL', label: 'General Message', icon: MessageSquare, color: 'text-gray-600' },
];

const priorityLevels = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-300' },
];

export function CreateInstructionModal({
  open,
  onOpenChange,
  packageId,
  isPending,
  onSubmit,
}: CreateInstructionModalProps) {
  const NOMINATIM_BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateInstructionDto>({
    packageId,
    title: "",
    message: "",
    type: "GENERAL",
    priority: "MEDIUM",
  });

  const [includeLocation, setIncludeLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 9.9312, lng: 76.2673 });
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must not exceed 1000 characters";
    }

    if (!formData.type) {
      newErrors.type = "Instruction type is required";
    }

    if (includeLocation) {
      if (!formData.location?.name?.trim()) {
        newErrors.locationName = "Location name is required";
      }
      if (!formData.location?.address?.trim()) {
        newErrors.locationAddress = "Location address is required";
      }
      if (!formData.location?.coordinates?.lat || !formData.location?.coordinates?.lng) {
        newErrors.locationCoordinates = "Valid coordinates are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const searchLocation = async (query: string) => {
  if (!query.trim() || query.length < 3) {
    setSearchResults([]);
    return;
  }

  setIsSearching(true);

  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        format: "json",
        q: query,
        limit: 5,
      },
    });

    setSearchResults(response.data);
    setShowResults(true);
  } catch (error) {
    console.error("Error searching location:", error);
  } finally {
    setIsSearching(false);
  }
};


  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const selectSearchResult = (result: SearchResult) => {
    const locationName = result.name || result.display_name.split(",")[0];
    setFormData({
      ...formData,
      location: {
        name: locationName,
        address: result.display_name,
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
      },
    });
    setSearchQuery(result.display_name);
    setShowResults(false);
    setSearchResults([]);
    setMapCenter({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    if (errors.locationName) setErrors({ ...errors, locationName: "", locationAddress: "", locationCoordinates: "" });
  };

const getCurrentLocation = async () => {
  setIsGettingLocation(true);

  try {
    // ✅ Step 1: Get current GPS position
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
      });
    });

    const { latitude, longitude } = position.coords;

    // ✅ Step 2: Reverse geocode using Axios
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        format: "json",
        lat: latitude,
        lon: longitude,
      },
    });

    const data = response.data;

    setFormData({
      ...formData,
      location: {
        name: data.name || data.display_name?.split(",")[0],
        address: data.display_name,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      },
    });

    setSearchQuery(data.display_name);
    setMapCenter({ lat: latitude, lng: longitude });

    if (errors.locationName) {
      setErrors({
        ...errors,
        locationName: "",
        locationAddress: "",
        locationCoordinates: "",
      });
    }
  } catch (error) {
    console.error("Error getting location:", error);
    alert("Unable to get your location. Please check your browser permissions.");
  } finally {
    setIsGettingLocation(false);
  }
};

const handleMapClick = async (lat: number, lng: number) => {
  try {
    // ✅ Reverse geocoding with Axios
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        format: "json",
        lat,
        lon: lng,
      },
    });

    const data = response.data;

    setFormData({
      ...formData,
      location: {
        name: data.name || data.display_name?.split(",")[0],
        address: data.display_name,
        coordinates: { lat, lng },
      },
    });

    setSearchQuery(data.display_name);
    setMapCenter({ lat, lng });

    if (errors.locationName) {
      setErrors({
        ...errors,
        locationName: "",
        locationAddress: "",
        locationCoordinates: "",
      });
    }
  } catch (error) {
    console.error("Error getting location details:", error);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      if (!includeLocation) {
        delete submitData.location;
      }
       onSubmit(submitData);
       setTimeout(() =>{
        handleClose();
       },2000)
      
    } catch (error) {
      console.error("Error submitting instruction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      packageId,
      title: "",
      message: "",
      type: "GENERAL",
      priority: "MEDIUM",
    });
    setIncludeLocation(false);
    setErrors({});
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setShowMapPicker(false);
    onOpenChange(false);
  };

  const selectedType = instructionTypes.find(t => t.value === formData.type);
  const TypeIcon = selectedType?.icon || MessageSquare;

  useEffect(() => {
    if (!open) {
      handleClose();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Send className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Send Travel Instructions
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Share important information with your travelers
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Instruction Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-semibold">
              Instruction Type *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as any })
              }
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {instructionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Priority Level</Label>
            <div className="flex gap-2 flex-wrap">
              {priorityLevels.map((priority) => (
                <Badge
                  key={priority.value}
                  className={`cursor-pointer px-4 py-2 transition-all ${
                    formData.priority === priority.value
                      ? priority.color + ' ring-2 ring-offset-2'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, priority: priority.value as any })
                  }
                >
                  {priority.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title *
            </Label>
            <div className="relative">
              <TypeIcon className={`absolute left-3 top-3 h-4 w-4 ${selectedType?.color}`} />
              <Input
                id="title"
                placeholder="e.g., Meeting at Hotel Lobby"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                className={`pl-10 ${errors.title ? "border-red-500" : ""}`}
                maxLength={100}
              />
            </div>
            <div className="flex justify-between items-center">
              {errors.title ? (
                <p className="text-xs text-red-500">{errors.title}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Make it clear and concise
                </p>
              )}
              <span className="text-xs text-muted-foreground">
                {formData.title.length}/100
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Provide detailed instructions for your travelers..."
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: "" });
              }}
              className={`min-h-[120px] resize-none ${
                errors.message ? "border-red-500" : ""
              }`}
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              {errors.message ? (
                <p className="text-xs text-red-500">{errors.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Be specific and helpful
                </p>
              )}
              <span className="text-xs text-muted-foreground">
                {formData.message.length}/1000
              </span>
            </div>
          </div>

          {/* Location Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeLocation"
                checked={includeLocation}
                onChange={(e) => {
                  setIncludeLocation(e.target.checked);
                  if (!e.target.checked) {
                    setFormData({ ...formData, location: undefined });
                    setErrors({ ...errors, locationName: "", locationAddress: "", locationCoordinates: "" });
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor="includeLocation" className="text-sm font-semibold cursor-pointer">
                Include Location Details
              </Label>
            </div>

            {includeLocation && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Navigation className="h-4 w-4" />
                    <span className="text-sm font-semibold">Location Information</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="text-xs"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Crosshair className="h-3 w-3 mr-1" />
                      )}
                      Current Location
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      className="text-xs"
                    >
                      <Map className="h-3 w-3 mr-1" />
                      {showMapPicker ? "Hide" : "Show"} Map
                    </Button>
                  </div>
                </div>

                {/* Location Search */}
                <div className="space-y-2 relative">
                  <Label htmlFor="locationSearch" className="text-sm">
                    Search Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="locationSearch"
                      placeholder="Search for a place..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => searchResults.length > 0 && setShowResults(true)}
                      className="pl-10"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.place_id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectSearchResult(result)}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {result.name || result.display_name.split(",")[0]}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {result.display_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Map Picker */}
                {showMapPicker && (
                  <div className="space-y-2">
                    <Label className="text-sm">Click on map to select location</Label>
                    <div 
                      className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-crosshair relative overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const lat = mapCenter.lat + (0.01 * (0.5 - y / rect.height));
                        const lng = mapCenter.lng + (0.01 * (x / rect.width - 0.5));
                        handleMapClick(lat, lng);
                      }}
                    >
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng-0.005},${mapCenter.lat-0.005},${mapCenter.lng+0.005},${mapCenter.lat+0.005}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
                        className="w-full h-full border-0"
                        style={{ pointerEvents: 'none' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <MapPin className="h-8 w-8 text-red-600 drop-shadow-lg" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Click anywhere on the map to select that location
                    </p>
                  </div>
                )}

                {/* Location Details */}
                {formData.location && (
                  <div className="space-y-3 p-3 bg-white rounded-md border border-blue-200">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Selected Location</Label>
                      <p className="text-sm font-medium">{formData.location.name}</p>
                      <p className="text-xs text-muted-foreground">{formData.location.address}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted-foreground">
                          Lat: <span className="font-mono text-foreground">{formData.location.coordinates.lat.toFixed(6)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Lng: <span className="font-mono text-foreground">{formData.location.coordinates.lng.toFixed(6)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(errors.locationName || errors.locationAddress || errors.locationCoordinates) && (
                  <p className="text-xs text-red-500">
                    {errors.locationName || errors.locationAddress || errors.locationCoordinates}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Instructions
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}