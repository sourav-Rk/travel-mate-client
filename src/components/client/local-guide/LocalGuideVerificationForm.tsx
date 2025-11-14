
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  MapPin,
  DollarSign,
  Languages,
  Award,
  FileText,
  User,
  ArrowLeft,
  Loader2,
  X,
  Navigation,
  Search,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useRequestVerification, useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { uploadImages } from "@/services/client/client.service";
import { GUIDE_SPECIALTIES } from "@/constants/local-guide.constants";
import type { RequestVerificationRequest } from "@/types/local-guide";
import { useClientAuth } from "@/hooks/auth/useAuth";

interface DocumentFile {
  file: File;
  preview: string;
  type: "idProof" | "addressProof" | "additional";
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
];

export function LocalGuideVerificationForm() {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();
  const { mutateAsync: requestVerification, isPending } =
    useRequestVerification();
  const { data: existingProfile } = useLocalGuideProfileQuery(isLoggedIn);
  const isResubmission = existingProfile?.verificationStatus === "rejected";

  const idProofRef = useRef<HTMLInputElement>(null);
  const addressProofRef = useRef<HTMLInputElement>(null);
  const additionalDocsRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const [idProofFile, setIdProofFile] = useState<DocumentFile | null>(null);
  const [addressProofFile, setAddressProofFile] =
    useState<DocumentFile | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<DocumentFile[]>([]);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const formik = useFormik<RequestVerificationRequest>({
    initialValues: {
      idProof: "",
      addressProof: "",
      additionalDocuments: [] as string[],
      location: {
        coordinates: [0, 0] as [number, number],
        city: "",
        state: "",
        country: "",
        address: "",
        formattedAddress: "",
      },
      hourlyRate: 0,
      languages: [] as string[],
      specialties: [] as string[],
      bio: "",
      profileImage: "",
      isAvailable: true,
      availabilityNote: "",
    },
    // Remove validation schema - we validate manually in handleSubmit
    // validationSchema: localGuideVerificationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Formik onSubmit called with values:", values);
      console.log("Selected languages:", selectedLanguages);
      
      // Sync languages before submission
      const valuesWithLanguages: RequestVerificationRequest = {
        ...values,
        languages: selectedLanguages.length > 0 ? selectedLanguages : values.languages || [],
      };
      
      console.log("Values with languages:", valuesWithLanguages);
      await handleSubmit(valuesWithLanguages);
      setSubmitting(false);
    },
  });

  // Sync languages with Formik when selectedLanguages change
  useEffect(() => {
    if (selectedLanguages.length > 0) {
      formik.setFieldValue("languages", selectedLanguages, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguages]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          formik.setFieldValue("location.coordinates", [longitude, latitude]);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            if (data.address) {
              formik.setFieldValue("location.city", data.address.city || data.address.town || data.address.village || "");
              formik.setFieldValue("location.state", data.address.state || "");
              formik.setFieldValue("location.country", data.address.country || "");
              formik.setFieldValue("location.address", data.display_name || "");
              formik.setFieldValue("location.formattedAddress", data.display_name || "");
            }
            toast.success("Current location detected!");
          } catch {
            toast.error("Failed to get address details");
          }
          setIsGettingLocation(false);
        },
        () => {
          toast.error("Failed to get current location");
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
    }
  };

  const searchLocation = async () => {
    if (!locationSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch {
      toast.error("Failed to search location");
    }
    setIsSearching(false);
  };

  const selectSearchResult = (result: any) => {
    formik.setFieldValue("location.coordinates", [parseFloat(result.lon), parseFloat(result.lat)]);
    formik.setFieldValue("location.city", result.address?.city || result.address?.town || result.address?.village || "");
    formik.setFieldValue("location.state", result.address?.state || "");
    formik.setFieldValue("location.country", result.address?.country || "");
    formik.setFieldValue("location.address", result.display_name || "");
    formik.setFieldValue("location.formattedAddress", result.display_name || "");
    setSearchResults([]);
    setLocationSearch("");
    toast.success("Location selected!");
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "idProof" | "addressProof" | "additional" | "profileImage"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (type === "profileImage") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        setProfileImageFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const docFile: DocumentFile = {
          file,
          preview: result,
          type,
        };

        if (type === "idProof") {
          setIdProofFile(docFile);
        } else if (type === "addressProof") {
          setAddressProofFile(docFile);
        } else if (type === "additional") {
          setAdditionalDocs((prev) => [...prev, docFile]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdditionalDoc = (index: number) => {
    setAdditionalDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    const trimmed = languageInput.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages((prev) => [...prev, trimmed]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setSelectedLanguages((prev) => prev.filter((l) => l !== lang));
  };

  const handleSpecialtyChange = (specialty: string) => {
    const current = formik.values.specialties || [];
    const updatedSpecialties = current.includes(specialty)
      ? current.filter((s) => s !== specialty)
      : [...current, specialty];
    
    formik.setFieldValue("specialties", updatedSpecialties);
  };

  const handleSubmit = async (values: RequestVerificationRequest): Promise<void> => {
    // Validate required files
    if (!idProofFile) {
      toast.error("ID proof is required");
      formik.setFieldTouched("idProof", true);
      return;
    }

    if (!addressProofFile) {
      toast.error("Address proof is required");
      formik.setFieldTouched("addressProof", true);
      return;
    }

    // Validate languages
    if (selectedLanguages.length === 0) {
      toast.error("At least one language is required");
      formik.setFieldTouched("languages", true);
      return;
    }

    // Validate location coordinates
    if (!values.location.coordinates || values.location.coordinates.length !== 2) {
      toast.error("Location coordinates are required");
      formik.setFieldTouched("location.coordinates", true);
      return;
    }

    // Check if coordinates are valid (not [0,0])
    const [longitude, latitude] = values.location.coordinates;
    if (longitude === 0 && latitude === 0) {
      toast.error("Please set a valid location. Use 'Use Current Location' or search for a location.");
      formik.setFieldTouched("location.coordinates", true);
      return;
    }

    // Validate coordinate ranges
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      toast.error("Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.");
      formik.setFieldTouched("location.coordinates", true);
      return;
    }

    // Validate required location fields
    if (!values.location.city || !values.location.state || !values.location.country) {
      toast.error("City, state, and country are required");
      return;
    }

    try {

      // Upload documents
      const uploadPromises: Promise<string>[] = [
        uploadImages([idProofFile.file]).then((res) => res[0].url),
        uploadImages([addressProofFile.file]).then((res) => res[0].url),
      ];

      let additionalDocuments: string[] = [];
      if (additionalDocs.length > 0) {
        const additionalUrls = await uploadImages(
          additionalDocs.map((doc) => doc.file)
        );
        additionalDocuments = additionalUrls.map((img) => img.url);
      }

      let profileImageUrl = "";
      if (profileImageFile) {
        const profileResult = await uploadImages([profileImageFile]);
        profileImageUrl = profileResult[0].url;
      }

      const [idProofUrl, addressProofUrl] = await Promise.all(uploadPromises);

      // Prepare submit data
      const submitData: RequestVerificationRequest = {
        idProof: idProofUrl,
        addressProof: addressProofUrl,
        additionalDocuments: additionalDocuments.length > 0 ? additionalDocuments : undefined,
        location: {
          coordinates: values.location.coordinates,
          city: values.location.city,
          state: values.location.state,
          country: values.location.country,
          address: values.location.address || undefined,
          formattedAddress: values.location.formattedAddress || undefined,
        },
        hourlyRate: values.hourlyRate && values.hourlyRate > 0 ? values.hourlyRate : undefined,
        languages: selectedLanguages,
        specialties: values.specialties && values.specialties.length > 0 ? values.specialties : undefined,
        bio: values.bio || undefined,
        profileImage: profileImageUrl || undefined,
        isAvailable: values.isAvailable ?? true,
        availabilityNote: values.availabilityNote || undefined,
      };

      await requestVerification(submitData);
      toast.success(
        isResubmission
          ? "Verification request resubmitted successfully! Your request is now pending review."
          : "Verification request submitted successfully!"
      );
      // Navigate to volunteering page to see updated status
      navigate("/volunteering");
    } catch (error: unknown) {
      console.error("Error submitting verification:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 
        (error as Error)?.message ||
        "Failed to submit verification request";
      toast.error(errorMessage);
    }
  };

  // Helper to check if field has error
  const hasError = (field: string): boolean => {
    return !!(formik.errors as any)[field] && (formik.touched as any)[field];
  };

  const getError = (field: string): string => {
    return hasError(field) ? (formik.errors as any)[field] : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 md:p-6 lg:p-8 md:ml-80">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/pvt/profile")}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1396b0] to-[#5aabba] bg-clip-text text-transparent">
              {isResubmission ? "Resubmit Verification" : "Become a Local Guide"}
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              {isResubmission
                ? "Update your verification information and resubmit your request"
                : "Share your local knowledge and help travelers discover authentic experiences"}
            </p>
            {isResubmission && existingProfile?.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Previous rejection reason:</strong> {existingProfile.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>

        <form 
          onSubmit={formik.handleSubmit} 
          className="space-y-6"
        >
          {/* Verification Documents */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/60">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-[#1a5f6b]">
                <FileText className="h-5 w-5 text-[#2CA4BC]" />
                Verification Documents
              </CardTitle>
              <CardDescription className="text-slate-600">
                Upload required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Proof */}
              <div className="space-y-2">
                <Label htmlFor="idProof" className="text-slate-700 font-medium">ID Proof *</Label>
                <div className="relative">
                  <Input
                    ref={idProofRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, "idProof")}
                    className="hidden"
                    id="idProof"
                  />
                  <div
                    onClick={() => idProofRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      idProofFile
                        ? "border-[#2CA4BC] bg-[#2CA4BC]/5"
                        : "border-slate-300 hover:border-[#2CA4BC] hover:bg-[#2CA4BC]/5"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {idProofFile ? (
                        <>
                          <CheckCircle className="h-10 w-10 text-[#2CA4BC]" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-[#1a5f6b]">
                              {idProofFile.file.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Click to change file
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-slate-400" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">
                              Click to upload ID Proof
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PDF or Image (max 5MB)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {!idProofFile && formik.submitCount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠</span> ID proof is required
                  </p>
                )}
              </div>

              {/* Address Proof */}
              <div className="space-y-2">
                <Label htmlFor="addressProof" className="text-slate-700 font-medium">Address Proof *</Label>
                <div className="relative">
                  <Input
                    ref={addressProofRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, "addressProof")}
                    className="hidden"
                    id="addressProof"
                  />
                  <div
                    onClick={() => addressProofRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      addressProofFile
                        ? "border-[#2CA4BC] bg-[#2CA4BC]/5"
                        : "border-slate-300 hover:border-[#2CA4BC] hover:bg-[#2CA4BC]/5"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {addressProofFile ? (
                        <>
                          <CheckCircle className="h-10 w-10 text-[#2CA4BC]" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-[#1a5f6b]">
                              {addressProofFile.file.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Click to change file
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-slate-400" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">
                              Click to upload Address Proof
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PDF or Image (max 5MB)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {!addressProofFile && formik.submitCount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠</span> Address proof is required
                  </p>
                )}
              </div>

              {/* Additional Documents */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Additional Documents (Optional)</Label>
                <Input
                  ref={additionalDocsRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "additional")}
                  className="hidden"
                />
                <div
                  onClick={() => additionalDocsRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:border-[#2CA4BC] hover:bg-[#2CA4BC]/5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload className="h-10 w-10 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">
                      Add Additional Document
                    </p>
                  </div>
                </div>
                {additionalDocs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {additionalDocs.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 hover:bg-slate-100/80 transition-colors"
                      >
                        <span className="text-sm font-medium text-slate-700">{doc.file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalDoc(index)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/60">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-[#1a5f6b]">
                <MapPin className="h-5 w-5 text-[#2CA4BC]" />
                Location
              </CardTitle>
              <CardDescription className="text-slate-600">
                Select your location with precise coordinates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isGettingLocation ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="mr-2 h-4 w-4" />
                  )}
                  Use Current Location
                </Button>
              </div>

              {/* Location Search */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Search Location</Label>
                <div className="flex gap-2">
                  <Input
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchLocation())}
                    placeholder="Search for a place..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={searchLocation}
                    disabled={isSearching || !locationSearch.trim()}
                    className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="border border-slate-200/60 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-white">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => selectSearchResult(result)}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-700">{result.display_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coordinates Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-slate-700 font-medium">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-180 to 180"
                    value={
                      formik.values.location.coordinates[0] === 0
                        ? ""
                        : formik.values.location.coordinates[0]
                    }
                    onChange={(e) => {
                      const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      if (!isNaN(newValue)) {
                        formik.setFieldValue("location.coordinates", [
                          newValue,
                          formik.values.location.coordinates[1],
                        ]);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {hasError("location.coordinates") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {getError("location.coordinates")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-slate-700 font-medium">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-90 to 90"
                    value={
                      formik.values.location.coordinates[1] === 0
                        ? ""
                        : formik.values.location.coordinates[1]
                    }
                    onChange={(e) => {
                      const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      if (!isNaN(newValue)) {
                        formik.setFieldValue("location.coordinates", [
                          formik.values.location.coordinates[0],
                          newValue,
                        ]);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700 font-medium">City *</Label>
                  <Input
                    id="city"
                    value={formik.values.location.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="location.city"
                  />
                  {hasError("location.city") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {getError("location.city")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700 font-medium">State *</Label>
                  <Input
                    id="state"
                    value={formik.values.location.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="location.state"
                  />
                  {hasError("location.state") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {getError("location.state")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-700 font-medium">Country *</Label>
                  <Input
                    id="country"
                    value={formik.values.location.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="location.country"
                  />
                  {hasError("location.country") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {getError("location.country")}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-medium">Address (Optional)</Label>
                <Input
                  id="address"
                  value={formik.values.location.address || ""}
                  onChange={formik.handleChange}
                  name="location.address"
                  placeholder="Street address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/60">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-[#1a5f6b]">
                <User className="h-5 w-5 text-[#2CA4BC]" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Profile Image (Optional)</Label>
                <Input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "profileImage")}
                  className="hidden"
                />
                <div
                  onClick={() => profileImageRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:border-[#2CA4BC] hover:bg-[#2CA4BC]/5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    {profileImagePreview ? (
                      <>
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="h-32 w-32 rounded-full object-cover border-4 border-[#2CA4BC] shadow-lg"
                        />
                        <p className="text-sm text-slate-600">Click to change image</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-16 w-16 text-slate-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-700">
                            Upload Profile Image
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG (max 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="flex items-center gap-2 text-slate-700 font-medium">
                  <DollarSign className="h-4 w-4 text-[#2CA4BC]" />
                  Hourly Rate (₹ per hour)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  max="10000"
                  value={
                    formik.values.hourlyRate === 0
                      ? ""
                      : formik.values.hourlyRate
                  }
                  onChange={(e) => {
                    const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      formik.setFieldValue("hourlyRate", newValue);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="0"
                />
                {hasError("hourlyRate") && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠</span> {getError("hourlyRate")}
                  </p>
                )}
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                  <Languages className="h-4 w-4 text-[#2CA4BC]" />
                  Languages *
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLanguages.map((lang) => (
                    <div
                      key={lang}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={languageInput}
                    onValueChange={setLanguageInput}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select or type a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_LANGUAGES.filter(
                        (lang) => !selectedLanguages.includes(lang)
                      ).map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLanguage}
                    disabled={!languageInput.trim()}
                    className="border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white transition-all"
                  >
                    Add
                  </Button>
                </div>
                {selectedLanguages.length === 0 && formik.submitCount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="text-xs">⚠</span> At least one language is required
                  </p>
                )}
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                  <Award className="h-4 w-4 text-[#2CA4BC]" />
                  Specialties (Optional)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(GUIDE_SPECIALTIES).map(([key, value]) => {
                    const isChecked = formik.values.specialties?.includes(value) || false;
                    return (
                      <div 
                        key={key} 
                        role="button"
                        tabIndex={0}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          isChecked
                            ? "border-[#2CA4BC] bg-[#2CA4BC]/10"
                            : "border-slate-200 hover:border-[#2CA4BC]/50 hover:bg-[#2CA4BC]/5"
                        }`}
                        onClick={() => handleSpecialtyChange(value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSpecialtyChange(value);
                          }
                        }}
                      >
                        <div
                          className={`size-4 rounded border-2 flex items-center justify-center ${
                            isChecked
                              ? "border-[#2CA4BC] bg-[#2CA4BC]"
                              : "border-slate-300"
                          }`}
                        >
                          {isChecked && (
                            <CheckCircle className="size-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-normal cursor-pointer capitalize flex-1">
                          {value.replace("-", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-700 font-medium">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formik.values.bio || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Tell travelers about yourself and your expertise..."
                  rows={5}
                  maxLength={1000}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">
                    {formik.values.bio?.length || 0}/1000 characters
                  </p>
                  {hasError("bio") && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="text-xs">⚠</span> {getError("bio")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6 bg-slate-200/60" />

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/pvt/profile")}
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-100 transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || formik.isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isPending || formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Verification Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}