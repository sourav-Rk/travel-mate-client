"use client"

import { useState, useRef } from "react"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Edit3,
  Navigation,
  Search,
  X,
  Image as ImageIcon,
  Loader2,
  Save,
  Calendar,
  MapPin,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useUpdateLocalGuideProfile } from "@/hooks/local-guide/useLocalGuideVerification"
import { uploadImages } from "@/services/client/client.service"
import { GUIDE_SPECIALTIES } from "@/constants/local-guide.constants"
import type { LocalGuideProfile, UpdateProfileRequest } from "@/types/local-guide"

interface EditProfileSectionProps {
  profile: LocalGuideProfile
  onUpdate?: () => void
}

const COMMON_LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
]

export function EditProfileSection({ profile, onUpdate }: EditProfileSectionProps) {
  const { mutateAsync: updateProfile, isPending } = useUpdateLocalGuideProfile()
  const profileImageRef = useRef<HTMLInputElement>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    profile.profileImage || null
  )
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profile.languages || [])
  const [languageInput, setLanguageInput] = useState("")
  const [locationSearch, setLocationSearch] = useState(
    profile.location
      ? `${profile.location.city || ""}, ${profile.location.state || ""}, ${profile.location.country || ""}`.replace(/^,\s*|,\s*$/g, "")
      : ""
  )
  const [searchResults, setSearchResults] = useState<Array<{
    place_name: string
    center: [number, number]
    address?: {
      city?: string
      town?: string
      village?: string
      state?: string
      country?: string
    }
  }>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const formik = useFormik<UpdateProfileRequest>({
    initialValues: {
      location: profile.location
        ? {
            coordinates: profile.location.coordinates,
            city: profile.location.city,
            state: profile.location.state,
            country: profile.location.country,
            address: profile.location.address,
            formattedAddress: profile.location.formattedAddress,
          }
        : undefined,
      hourlyRate: profile.hourlyRate || 0,
      languages: profile.languages || [],
      specialties: profile.specialties || [],
      bio: profile.bio || "",
      profileImage: profile.profileImage || "",
      isAvailable: profile.isAvailable ?? true,
      availabilityNote: profile.availabilityNote || "",
    },
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      const errors: {
        location?: {
          coordinates?: string
          city?: string
          state?: string
          country?: string
          address?: string
          formattedAddress?: string
        }
      } = {}

      // Validate location if provided
      if (values.location) {
        const locationErrors: {
          coordinates?: string
          city?: string
          state?: string
          country?: string
          address?: string
          formattedAddress?: string
        } = {}

        // Validate coordinates
        const coordinates = values.location.coordinates
        if (!coordinates || coordinates.length !== 2) {
          locationErrors.coordinates = "Coordinates are required"
        } else {
          const [longitude, latitude] = coordinates
          if (
            longitude === undefined ||
            latitude === undefined ||
            isNaN(longitude) ||
            isNaN(latitude)
          ) {
            locationErrors.coordinates = "Invalid coordinates. Longitude and latitude must be valid numbers"
          } else {
            if (longitude < -180 || longitude > 180) {
              locationErrors.coordinates = "Longitude must be between -180 and 180"
            }
            if (latitude < -90 || latitude > 90) {
              locationErrors.coordinates = "Latitude must be between -90 and 90"
            }
          }
        }

        // Validate required fields
        const city = values.location.city?.trim()
        const state = values.location.state?.trim()
        const country = values.location.country?.trim()

        if (!city || city === "") {
          locationErrors.city = "City is required"
        }

        if (!state || state === "") {
          locationErrors.state = "State is required"
        }

        if (!country || country === "") {
          locationErrors.country = "Country is required"
        }

        // Validate address fields if provided
        const address = values.location.address?.trim()
        const formattedAddress = values.location.formattedAddress?.trim()

        if (address && address.length > 500) {
          locationErrors.address = "Street address cannot exceed 500 characters"
        }

        if (formattedAddress && formattedAddress.length > 500) {
          locationErrors.formattedAddress = "Formatted address cannot exceed 500 characters"
        }

        if (Object.keys(locationErrors).length > 0) {
          errors.location = locationErrors
        }
      }

      return errors
    },
    onSubmit: async (values, { setFieldTouched, setErrors, validateForm }) => {
      // Mark all location fields as touched to show validation errors
      if (values.location) {
        setFieldTouched("location", true)
        setFieldTouched("location.coordinates", true)
        setFieldTouched("location.city", true)
        setFieldTouched("location.state", true)
        setFieldTouched("location.country", true)
        setFieldTouched("location.address", true)
        setFieldTouched("location.formattedAddress", true)
      }

      // Run validation
      const validationErrors = await validateForm()
      if (validationErrors && Object.keys(validationErrors).length > 0 ) {
        setErrors(validationErrors)
        // Show first error in toast
        if (validationErrors.location) {
          const locationErrors = validationErrors.location
          if (locationErrors.coordinates) {
            toast.error(locationErrors.coordinates)
          } else if (locationErrors.city) {
            toast.error(locationErrors.city)
          } else if (locationErrors.state) {
            toast.error(locationErrors.state)
          } else if (locationErrors.country) {
            toast.error(locationErrors.country)
          } else if (locationErrors.address) {
            toast.error(locationErrors.address)
          } else if (locationErrors.formattedAddress) {
            toast.error(locationErrors.formattedAddress)
          }
        }
        return // Prevent form submission
      }

      try {

        // Upload profile image if changed
        let profileImageUrl = values.profileImage
        if (profileImageFile) {
          const formData = new FormData()
          formData.append("images", profileImageFile)
          const uploadResponse = await uploadImages(formData)
          if ( uploadResponse[0].url && uploadResponse.length> 0) {
            profileImageUrl = uploadResponse[0].url
          }
        }

        // Prepare submission data with validated location
        const submitData: UpdateProfileRequest = {
          location: values.location
            ? {
                coordinates: values.location.coordinates as [number, number],
                city: values.location.city.trim(),
                state: values.location.state.trim(),
                country: values.location.country.trim(),
                address: values.location.address?.trim() || undefined,
                formattedAddress: values.location.formattedAddress?.trim() || undefined,
              }
            : undefined,
          hourlyRate: values.hourlyRate,
          languages: selectedLanguages.length > 0 ? selectedLanguages : values.languages || [],
          specialties: values.specialties,
          bio: values.bio,
          profileImage: profileImageUrl,
          isAvailable: values.isAvailable,
          availabilityNote: values.availabilityNote || undefined,
        }

        await updateProfile(submitData)
        toast.success("Profile updated successfully!")
        onUpdate?.()
      } catch (error: unknown) {
        console.error("Error updating profile:", error)
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (error as Error)?.message ||
          "Failed to update profile"
        toast.error(errorMessage)
      }
    },
  })

  // Location search using Nominatim (OpenStreetMap) - same as verification form
  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      )
      const data = await response.json()
      setSearchResults(
        data.map((result: {
          lat: string
          lon: string
          display_name: string
          address?: {
            city?: string
            town?: string
            village?: string
            state?: string
            country?: string
          }
        }) => ({
          place_name: result.display_name,
          center: [parseFloat(result.lon), parseFloat(result.lat)] as [number, number],
          address: result.address,
        }))
      )
    } catch (error) {
      console.error("Location search error:", error)
      toast.error("Failed to search locations")
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocationSelect = (result: {
    place_name: string
    center: [number, number]
    address?: {
      city?: string
      town?: string
      village?: string
      state?: string
      country?: string
    }
  }) => {
    const [longitude, latitude] = result.center
    const city = result.address?.city || result.address?.town || result.address?.village || ""
    const state = result.address?.state || ""
    const country = result.address?.country || ""

    // Preserve existing address fields when selecting a new location
    const existingAddress = formik.values.location?.address || ""
    const existingFormattedAddress = formik.values.location?.formattedAddress || ""
    
    formik.setFieldValue("location", {
      coordinates: [longitude, latitude] as [number, number],
      city,
      state,
      country,
      // Preserve manually entered address, or use place_name if no address was entered
      address: existingAddress || result.place_name,
      // Update formatted address with the selected location, but preserve if user had custom one
      formattedAddress: existingFormattedAddress || result.place_name,
    })
    // Mark fields as touched for validation display
    formik.setFieldTouched("location", true, false)
    setLocationSearch(result.place_name)
    setSearchResults([])
    toast.success("Location selected!")
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          const data = await response.json()
          if (data) {
            // Preserve existing address fields
            const existingAddress = formik.values.location?.address || ""
            const existingFormattedAddress = formik.values.location?.formattedAddress || ""
            
            const city = data.address?.city || data.address?.town || data.address?.village || ""
            const state = data.address?.state || ""
            const country = data.address?.country || ""
            
            formik.setFieldValue("location", {
              coordinates: [longitude, latitude] as [number, number],
              city,
              state,
              country,
              address: existingAddress || data.display_name,
              formattedAddress: existingFormattedAddress || data.display_name,
            })
            formik.setFieldTouched("location", true)
            formik.setFieldTouched("location.coordinates", true)
            formik.setFieldTouched("location.city", true)
            formik.setFieldTouched("location.state", true)
            formik.setFieldTouched("location.country", true)
            setLocationSearch(data.display_name)
            toast.success("Location updated from your current position!")
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error)
          toast.error("Failed to get location details")
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast.error("Failed to get your location")
        setIsGettingLocation(false)
      }
    )
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddLanguage = () => {
    const trimmed = languageInput.trim()
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages([...selectedLanguages, trimmed])
      setLanguageInput("")
    }
  }

  const handleRemoveLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
  }

  const handleSelectLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language])
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[#F5F1E8]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-[#1a5f6b]">
            <div className="p-2 bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] rounded-lg">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Profile Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {profileImagePreview && (
                  <div className="relative">
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#2CA4BC]/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImagePreview(null)
                        setProfileImageFile(null)
                        formik.setFieldValue("profileImage", "")
                        if (profileImageRef.current) {
                          profileImageRef.current.value = ""
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => profileImageRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {profileImagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB, JPG/PNG</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-[#2CA4BC]" />
                  Location Details
                </Label>
                
                {/* Location Search */}
                <div className="space-y-3 mb-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search for your location"
                        value={locationSearch}
                        onChange={(e) => {
                          setLocationSearch(e.target.value)
                          handleLocationSearch(e.target.value)
                        }}
                        className="pl-10"
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleLocationSelect(result)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                            >
                              <p className="text-sm text-slate-900">{result.place_name}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="whitespace-nowrap"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Location Fields - Always visible */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#2CA4BC]" />
                    <Label className="text-sm font-semibold text-slate-700">
                      Location Information
                    </Label>
                  </div>
                  
                  {/* Coordinates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="longitude" className="text-sm font-medium text-slate-700">
                        Longitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 72.8777"
                        value={formik.values.location?.coordinates?.[0] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const longitude = value === "" ? undefined : parseFloat(value)
                          const existingLocation = formik.values.location || profile.location
                          const latitude = existingLocation?.coordinates?.[1] ?? 0
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: [longitude ?? 0, latitude] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: existingLocation?.address,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              coordinates: [longitude ?? formik.values.location.coordinates[0], latitude] as [number, number],
                            })
                          }
                          // Clear coordinate error when user types
                          if (formik.errors.location?.coordinates) {
                            formik.setFieldError("location.coordinates", undefined)
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.coordinates", true)}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.coordinates && formik.errors.location?.coordinates
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        min="-180"
                        max="180"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Required: -180 to 180
                      </p>
                      {formik.touched.location?.coordinates && formik.errors.location?.coordinates && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.coordinates}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="latitude" className="text-sm font-medium text-slate-700">
                        Latitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 19.0760"
                        value={formik.values.location?.coordinates?.[1] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const latitude = value === "" ? undefined : parseFloat(value)
                          const existingLocation = formik.values.location || profile.location
                          const longitude = existingLocation?.coordinates?.[0] ?? 0
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: [longitude, latitude ?? 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: existingLocation?.address,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              coordinates: [longitude, latitude ?? formik.values.location.coordinates[1]] as [number, number],
                            })
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.coordinates", true)}
                        className={`w-full mt-1.5 ${
                          formik.values.location?.coordinates?.[1] !== undefined &&
                          formik.touched.location?.coordinates &&
                          (formik.values.location.coordinates[1] < -90 ||
                            formik.values.location.coordinates[1] > 90 ||
                            isNaN(formik.values.location.coordinates[1]))
                            ? "border-red-500"
                            : ""
                        }`}
                        min="-90"
                        max="90"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Required: -90 to 90
                      </p>
                      {formik.values.location?.coordinates?.[1] !== undefined &&
                        formik.touched.location?.coordinates &&
                        (formik.values.location.coordinates[1] < -90 ||
                          formik.values.location.coordinates[1] > 90 ||
                          isNaN(formik.values.location.coordinates[1])) && (
                          <p className="text-xs text-red-500 mt-1">
                            Latitude must be between -90 and 90
                          </p>
                        )}
                      {!formik.values.location?.coordinates?.[1] &&
                        formik.touched.location?.coordinates && (
                          <p className="text-xs text-red-500 mt-1">Latitude is required</p>
                        )}
                    </div>
                  </div>

                  {/* City, State, Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={formik.values.location?.city || ""}
                        onChange={(e) => {
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: e.target.value,
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: existingLocation?.address,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              city: e.target.value,
                            })
                          }
                          // Clear city error when user types
                          if (formik.errors.location?.city) {
                            formik.setFieldError("location.city", undefined)
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.city", true)}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.city && formik.errors.location?.city
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        required
                      />
                      {formik.touched.location?.city && formik.errors.location?.city && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-slate-700">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="e.g., Maharashtra"
                        value={formik.values.location?.state || ""}
                        onChange={(e) => {
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: e.target.value,
                              country: existingLocation?.country || "",
                              address: existingLocation?.address,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              state: e.target.value,
                            })
                          }
                          // Clear state error when user types
                          if (formik.errors.location?.state) {
                            formik.setFieldError("location.state", undefined)
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.state", true)}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.state && formik.errors.location?.state
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        required
                      />
                      {formik.touched.location?.state && formik.errors.location?.state && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-slate-700">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="e.g., India"
                        value={formik.values.location?.country || ""}
                        onChange={(e) => {
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: e.target.value,
                              address: existingLocation?.address,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              country: e.target.value,
                            })
                          }
                          // Clear country error when user types
                          if (formik.errors.location?.country) {
                            formik.setFieldError("location.country", undefined)
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.country", true)}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.country && formik.errors.location?.country
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        required
                      />
                      {formik.touched.location?.country && formik.errors.location?.country && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#2CA4BC]" />
                      <Label className="text-sm font-semibold text-slate-700">
                        Address Details (Optional)
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="street-address" className="text-sm font-medium text-slate-700">
                        Street Address
                      </Label>
                      <Input
                        id="street-address"
                        type="text"
                        placeholder="e.g., 123 Main Street, Building Name, Apartment 4B"
                        value={formik.values.location?.address || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          // Enforce max length
                          if (value.length > 500) {
                            return
                          }
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: value,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              address: value,
                            })
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.address", true)}
                        onChange={(e) => {
                          const value = e.target.value
                          // Enforce max length
                          if (value.length > 500) {
                            return
                          }
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: value,
                              formattedAddress: existingLocation?.formattedAddress,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              address: value,
                            })
                          }
                          // Clear address error when user types
                          if (formik.errors.location?.address) {
                            formik.setFieldError("location.address", undefined)
                          }
                        }}
                        maxLength={500}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.address && formik.errors.location?.address
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-slate-500">
                          Optional: Add your detailed street address, building name, or apartment number
                        </p>
                        <p className={`text-xs ${
                          formik.values.location?.address && formik.values.location.address.length > 450
                            ? "text-amber-600 font-medium"
                            : formik.values.location?.address && formik.values.location.address.length > 500
                            ? "text-red-500 font-medium"
                            : "text-slate-500"
                        }`}>
                          {(formik.values.location?.address || "").length}/500
                        </p>
                      </div>
                      {formik.touched.location?.address && formik.errors.location?.address && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="formatted-address" className="text-sm font-medium text-slate-700">
                        Full Formatted Address
                      </Label>
                      <Input
                        id="formatted-address"
                        type="text"
                        placeholder="e.g., 123 Main Street, Mumbai, Maharashtra 400001, India"
                        value={formik.values.location?.formattedAddress || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          // Enforce max length
                          if (value.length > 500) {
                            return
                          }
                          const existingLocation = formik.values.location || profile.location
                          if (!formik.values.location) {
                            formik.setFieldValue("location", {
                              coordinates: existingLocation?.coordinates || [0, 0] as [number, number],
                              city: existingLocation?.city || "",
                              state: existingLocation?.state || "",
                              country: existingLocation?.country || "",
                              address: existingLocation?.address,
                              formattedAddress: value,
                            })
                          } else {
                            formik.setFieldValue("location", {
                              ...formik.values.location,
                              formattedAddress: value,
                            })
                          }
                          // Clear formattedAddress error when user types
                          if (formik.errors.location?.formattedAddress) {
                            formik.setFieldError("location.formattedAddress", undefined)
                          }
                        }}
                        onBlur={() => formik.setFieldTouched("location.formattedAddress", true)}
                        maxLength={500}
                        className={`w-full mt-1.5 ${
                          formik.touched.location?.formattedAddress && formik.errors.location?.formattedAddress
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-slate-500">
                          Optional: Complete formatted address as it should appear to travelers
                        </p>
                        <p className={`text-xs ${
                          formik.values.location?.formattedAddress && formik.values.location.formattedAddress.length > 450
                            ? "text-amber-600 font-medium"
                            : formik.values.location?.formattedAddress && formik.values.location.formattedAddress.length > 500
                            ? "text-red-500 font-medium"
                            : "text-slate-500"
                        }`}>
                          {(formik.values.location?.formattedAddress || "").length}/500
                        </p>
                      </div>
                      {formik.touched.location?.formattedAddress && formik.errors.location?.formattedAddress && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {formik.errors.location.formattedAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Hourly Rate (₹)</Label>
              <Input
                type="number"
                min="0"
                max="10000"
                value={formik.values.hourlyRate || ""}
                onChange={(e) =>
                  formik.setFieldValue("hourlyRate", parseFloat(e.target.value) || 0)
                }
                placeholder="Enter hourly rate"
                className="w-full"
              />
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Languages</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select onValueChange={handleSelectLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_LANGUAGES.filter((lang) => !selectedLanguages.includes(lang)).map(
                        (lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Or type custom language"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddLanguage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddLanguage}>
                    Add
                  </Button>
                </div>
                {selectedLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#2CA4BC]/10 text-[#1a5f6b] rounded-full text-sm font-medium"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Specialties</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const current = formik.values.specialties || []
                  if (!current.includes(value)) {
                    formik.setFieldValue("specialties", [...current, value])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GUIDE_SPECIALTIES)
                    .filter((spec) => !formik.values.specialties?.includes(spec))
                    .map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec.charAt(0).toUpperCase() + spec.slice(1).replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formik.values.specialties && formik.values.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {spec.charAt(0).toUpperCase() + spec.slice(1).replace(/-/g, " ")}
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue(
                            "specialties",
                            formik.values.specialties?.filter((s) => s !== spec) || []
                          )
                        }}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Bio</Label>
              <Textarea
                value={formik.values.bio || ""}
                onChange={(e) => formik.setFieldValue("bio", e.target.value)}
                placeholder="Tell travelers about yourself and your tours..."
                rows={4}
                maxLength={1000}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                {(formik.values.bio || "").length}/1000 characters
              </p>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2CA4BC]" />
                Available for Bookings
              </Label>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    {formik.values.isAvailable
                      ? "You are currently available to accept bookings"
                      : "You are currently not accepting new bookings"}
                  </p>
                </div>
                <Switch
                  checked={formik.values.isAvailable ?? true}
                  onCheckedChange={(checked) => formik.setFieldValue("isAvailable", checked)}
                />
              </div>
            </div>

            {/* Availability Note */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Availability Note</Label>
              <Textarea
                value={formik.values.availabilityNote || ""}
                onChange={(e) => formik.setFieldValue("availabilityNote", e.target.value)}
                placeholder="e.g., 'Available only on weekends', 'Taking a break until next month'"
                rows={3}
                maxLength={500}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                {(formik.values.availabilityNote || "").length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
