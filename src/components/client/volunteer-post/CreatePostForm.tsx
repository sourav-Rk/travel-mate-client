import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  MapPin,
  X,
  Navigation,
  Search,
  Image as ImageIcon,
  Tag,
  Loader2,
  ArrowLeft,
  Send,
  Info,
  Plus,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { useCreateVolunteerPost, useUpdateVolunteerPost, useVolunteerPost } from "@/hooks/volunteer-post/useVolunteerPost";
import { uploadImages } from "@/services/client/client.service";
import type { CreateVolunteerPostRequest, UpdateVolunteerPostRequest } from "@/types/volunteer-post";
import { POST_CATEGORIES } from "@/utils/volunteer-post.validator";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { Spinner } from "@/components/Spinner";

interface ImageFile {
  file: File;
  preview: string;
}

const POST_CATEGORY_OPTIONS = POST_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

// Validation function
const validateForm = (values: CreateVolunteerPostRequest) => {
  const errors: any = {};

  // Title validation
  if (!values.title) {
    errors.title = "Title is required";
  } else if (values.title.length < 5) {
    errors.title = "Title must be at least 5 characters";
  } else if (values.title.length > 200) {
    errors.title = "Title cannot exceed 200 characters";
  }

  // Description validation
  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (values.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  // Content validation
  if (!values.content) {
    errors.content = "Content is required";
  } else if (values.content.length < 50) {
    errors.content = "Content must be at least 50 characters";
  } else if (values.content.length > 10000) {
    errors.content = "Content cannot exceed 10000 characters";
  }

  // Location validation
  if (!values.location.city || !values.location.state || !values.location.country) {
    errors.location = "Please complete location details";
  }

  // Category validation
  if (!values.category) {
    errors.category = "Category is required";
  }

  return errors;
};

export function CreatePostForm() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId?: string }>();
  const [imageUploading,setImageUploading] = useState(false);
  const isEditMode = !!postId;
  const { isLoggedIn } = useClientAuth();
  const { mutateAsync: createPost, isPending: isCreating } = useCreateVolunteerPost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdateVolunteerPost();
  const { data: profile, isLoading: isLoadingProfile, isError } = useLocalGuideProfileQuery(isLoggedIn);
  const { data: postResponse, isLoading: isLoadingPost } = useVolunteerPost(
    postId || "",
    false, // Don't increment views when editing
    isEditMode
  );
  
  const existingPost = postResponse?.post;
  const isPending = isCreating || isUpdating || imageUploading;

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // Debounced search effect
  useEffect(() => {
    if (locationSearch.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchLocation();
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [locationSearch]);

  // Initialize form values
  const getInitialValues = (): CreateVolunteerPostRequest => {
    if (isEditMode && existingPost && existingPost.location) {
      return {
        title: existingPost.title || "",
        description: existingPost.description || "",
        content: existingPost.content || "",
        category: existingPost.category || "other",
        location: {
          type: "Point",
          coordinates: existingPost.location.coordinates || [0, 0] as [number, number],
          city: existingPost.location.city || "",
          state: existingPost.location.state || "",
          country: existingPost.location.country || "",
        },
        images: existingPost.images || [],
        tags: existingPost.tags || [],
        offersGuideService: existingPost.offersGuideService || false,
      };
    }
    return {
      title: "",
      description: "",
      content: "",
      category: "other",
      location: {
        type: "Point",
        coordinates: [0, 0] as [number, number],
        city: "",
        state: "",
        country: "",
      },
      images: [],
      tags: [],
      offersGuideService: false,
    };
  };

  const formik = useFormik<CreateVolunteerPostRequest>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validate: validateForm,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  // Update form when post data loads
  useEffect(() => {
    if (isEditMode && existingPost && existingPost.location) {
      formik.setValues({
        title: existingPost.title || "",
        description: existingPost.description || "",
        content: existingPost.content || "",
        category: existingPost.category || "other",
        location: {
          type: "Point",
          coordinates: existingPost.location.coordinates || [0, 0] as [number, number],
          city: existingPost.location.city || "",
          state: existingPost.location.state || "",
          country: existingPost.location.country || "",
        },
        images: existingPost.images || [],
        tags: existingPost.tags || [],
        offersGuideService: existingPost.offersGuideService || false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPost, isEditMode]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          formik.setFieldValue("location.coordinates", [longitude, latitude], false);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data.address) {
              formik.setFieldValue("location.city", data.address.city || data.address.town || data.address.village || "", false);
              formik.setFieldValue("location.state", data.address.state || "", false);
              formik.setFieldValue("location.country", data.address.country || "", false);
            }
            // Clear location error if any
            if (formik.errors.location) {
              formik.setErrors({ ...formik.errors, location: undefined });
            }
            setLocationError("");
            toast.success("Current location detected!");
          } catch {
            toast.error("Failed to get address details");
          }
          setIsGettingLocation(false);
        },
        () => {
          toast.error("Failed to get current location");
          setLocationError("Failed to get current location");
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
    }
  };

  const searchLocation = async () => {
    if (!locationSearch.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Location search error:", error);
      toast.error("Failed to search location");
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const selectSearchResult = (result: any) => {
    formik.setFieldValue("location.coordinates", [parseFloat(result.lon), parseFloat(result.lat)], false);
    formik.setFieldValue("location.city", result.address?.city || result.address?.town || result.address?.village || "", false);
    formik.setFieldValue("location.state", result.address?.state || "", false);
    formik.setFieldValue("location.country", result.address?.country || "", false);
    // Clear location error if any
    if (formik.errors.location) {
      formik.setErrors({ ...formik.errors, location: undefined });
    }
    setLocationError("");
    setSearchResults([]);
    setLocationSearch("");
    toast.success("Location selected!");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push({ file, preview: result });
        if (newImages.length === files.length) {
          setImageFiles((prev) => {
            const updated = [...prev, ...newImages];
            if (updated.length > 10) {
              toast.error("Maximum 10 images allowed");
              return prev;
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formik.values.tags?.includes(trimmed)) {
      const currentTags = formik.values.tags || [];
      if (currentTags.length >= 20) {
        toast.error("Maximum 20 tags allowed");
        return;
      }
      formik.setFieldValue("tags", [...currentTags, trimmed], false);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = formik.values.tags || [];
    formik.setFieldValue("tags", currentTags.filter((t) => t !== tag), false);
  };

  const handleSubmit = async (values: CreateVolunteerPostRequest): Promise<void> => {
    if (isEditMode) {
      // Edit mode: Only update description, content, and tags
      const updateData: UpdateVolunteerPostRequest = {
        description: values.description,
        content: values.content,
        tags: values.tags || [],
      };

      try {
        const response = await updatePost({ postId: postId!, data: updateData });
        toast.success(response.message || "Post updated successfully");
        navigate("/pvt/my-posts");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to update post");
      }
      return;
    }

    // Create mode: Validate all fields
    // Validate location coordinates
    if (values.location.coordinates[0] === 0 && values.location.coordinates[1] === 0) {
      setLocationError("Please select a location");
      toast.error("Please select a location");
      return;
    }

    // Validate location details
    if (!values.location.city || !values.location.state || !values.location.country) {
      setLocationError("Please complete location details");
      toast.error("Please complete location details");
      return;
    }

    // Check if there are any form errors
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    // Upload images
    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        setImageUploading(true);
        const uploaded = await uploadImages(imageFiles.map((img) => img.file));
        imageUrls = uploaded.map((item) => item.url);
        setImageUploading(false);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to upload images");
        setImageUploading(false);
        return;
      }
    }

    // Prepare post data - status is always published (handled by backend)
    const postData: CreateVolunteerPostRequest = {
      ...values,
      images: imageUrls,
      location: {
        type: "Point",
        coordinates: values.location.coordinates,
        city: values.location.city,
        state: values.location.state,
        country: values.location.country,
      },
    };

    try {
      const response = await createPost(postData);
      toast.success(response.message);
      navigate("/pvt/my-posts");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create post");
    }
  };

  // Show loading state while checking profile or loading post
  if (isLoadingProfile || (isEditMode && isLoadingPost)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F1E8] via-white to-[#F5F1E8]/50">
        <Spinner />
      </div>
    );
  }

  // Show message if user doesn't have a local guide profile
  if (isLoggedIn && !profile && !isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] via-white to-[#F5F1E8]/50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-[#2CA4BC]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#1a5f6b]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {isEditMode ? "Edit Post" : "Create Post"}
            </h1>
            <div className="w-10"></div>
          </div>

          {/* No Profile Message */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Become a Local Guide First
              </CardTitle>
              <CardDescription className="text-base text-slate-700">
                You need to create a local guide profile before you can create volunteer posts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 text-[#2CA4BC]" />
                  Why become a local guide?
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2CA4BC] mt-1">•</span>
                    <span>Share your local knowledge and hidden gems with travelers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2CA4BC] mt-1">•</span>
                    <span>Earn money by offering guide services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2CA4BC] mt-1">•</span>
                    <span>Build your reputation as a trusted local expert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2CA4BC] mt-1">•</span>
                    <span>Connect with travelers from around the world</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/pvt/local-guide/verification")}
                  className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg h-12 text-base font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Local Guide Profile
                </Button>
                <Button
                  onClick={() => navigate("/volunteering")}
                  variant="outline"
                  className="flex-1 border-2 border-slate-300 hover:bg-slate-50 h-12 text-base"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] via-white to-[#F5F1E8]/50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#2CA4BC]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#1a5f6b]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Create Post</h1>
          <div className="w-10"></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Image Upload Section - Only show in create mode */}
          {!isEditMode && (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {imageFiles.length === 0 ? (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="p-6 rounded-full bg-gradient-to-br from-[#2CA4BC]/10 to-[#1a5f6b]/10 group-hover:from-[#2CA4BC]/20 group-hover:to-[#1a5f6b]/20 transition-all">
                    <ImageIcon className="h-12 w-12 text-[#2CA4BC]" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700 mb-1">Add Photos</p>
                    <p className="text-sm text-slate-500">Upload up to 10 images</p>
                  </div>
                </button>
              ) : (
                <div className="relative">
                  {/* Image Grid */}
                  <div className={`grid gap-1 ${imageFiles.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {imageFiles.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="relative aspect-square group">
                        <img
                          src={img.preview}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {idx === 3 && imageFiles.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <p className="text-white text-2xl font-bold">+{imageFiles.length - 4}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add More Button */}
                  {imageFiles.length < 10 && (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="absolute bottom-4 right-4 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all"
                    >
                      <Plus className="h-5 w-5 text-[#2CA4BC]" />
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Title - Only show in create mode */}
          {!isEditMode && (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div>
                  <Input
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Add a title..."
                    className={`border-0 border-b rounded-none px-0 text-lg font-semibold focus-visible:ring-0 ${
                      formik.errors.title && formik.touched.title
                        ? "border-red-500 focus-visible:border-red-500"
                        : "border-slate-200 focus-visible:border-[#2CA4BC]"
                    }`}
                    maxLength={200}
                  />
                  <div className="flex justify-between mt-1">
                    {formik.errors.title && formik.touched.title && (
                      <p className="text-xs text-red-500">{formik.errors.title}</p>
                    )}
                    <p className="text-xs text-slate-400 ml-auto">
                      {formik.values.title.length}/200
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description - Editable in both modes */}
          <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Write a description..."
                  className={`border-slate-200 resize-none focus-visible:ring-0 min-h-[100px] ${
                    formik.errors.description && formik.touched.description
                      ? "border-red-500 focus-visible:border-red-500"
                      : "border-slate-200 focus-visible:border-[#2CA4BC]"
                  }`}
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  {formik.errors.description && formik.touched.description && (
                    <p className="text-xs text-red-500">{formik.errors.description}</p>
                  )}
                  <p className="text-xs text-slate-400 ml-auto">
                    {formik.values.description.length}/500
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location - Only show in create mode */}
          {!isEditMode && (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-[#2CA4BC]" />
                <h3 className="font-semibold text-slate-900">Add Location</h3>
              </div>

              {(locationError || formik.errors.location) && (
                <p className="text-xs text-red-500 mb-3">{locationError}</p>
              )}

              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Search location..."
                      className="pl-10 border-slate-200 focus-visible:border-[#2CA4BC]"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="border-slate-200 hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC] hover:border-[#2CA4BC]"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSearchResult(result)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                      >
                        <p className="text-sm text-slate-900">{result.display_name}</p>
                      </button>
                    ))}
                  </div>
                )}

                {formik.values.location.city && (
                  <div className="flex items-center gap-2 p-3 bg-[#2CA4BC]/5 rounded-lg">
                    <MapPin className="h-4 w-4 text-[#2CA4BC] flex-shrink-0" />
                    <p className="text-sm text-slate-700">
                      {formik.values.location.city}, {formik.values.location.state}, {formik.values.location.country}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Tags - Editable in both modes */}
          <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-5 w-5 text-[#2CA4BC]" />
                <h3 className="font-semibold text-slate-900">Add Tags</h3>
              </div>

              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="border-slate-200 focus-visible:border-[#2CA4BC]"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-slate-200 hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC] hover:border-[#2CA4BC]"
                >
                  Add
                </Button>
              </div>

              {formik.values.tags && formik.values.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formik.values.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#2CA4BC]/10 text-[#1a5f6b] px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-[#2CA4BC] transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* More Details - Only show in create mode */}
          {!isEditMode && (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-[#2CA4BC]" />
                  <h3 className="font-semibold text-slate-900">Additional Details</h3>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Category</Label>
                  <Select
                    value={formik.values.category}
                    onValueChange={(value) => formik.setFieldValue("category", value, false)}
                  >
                    <SelectTrigger className={`border-slate-200 focus:ring-[#2CA4BC] ${
                      formik.errors.category ? "border-red-500 focus:border-red-500" : "focus:border-[#2CA4BC]"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.errors.category && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors.category}</p>
                  )}
                </div>

                {/* Offers Guide Service */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="offersGuideService"
                    checked={formik.values.offersGuideService}
                    onChange={(e) => formik.setFieldValue("offersGuideService", e.target.checked, false)}
                    className="w-5 h-5 text-[#2CA4BC] border-slate-300 rounded focus:ring-[#2CA4BC]"
                  />
                  <Label htmlFor="offersGuideService" className="text-sm font-medium text-slate-700 cursor-pointer">
                    I offer guide service for this location
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content - Editable in both modes */}
          <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-[#2CA4BC]" />
                <h3 className="font-semibold text-slate-900">Detailed Content</h3>
              </div>
              <div>
                <Textarea
                  id="content"
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Share your story, tips, and recommendations..."
                  className={`border-slate-200 focus-visible:border-[#2CA4BC] min-h-[200px] ${
                    formik.errors.content && formik.touched.content
                      ? "border-red-500 focus-visible:border-red-500"
                      : "border-slate-200 focus-visible:border-[#2CA4BC]"
                  }`}
                  maxLength={10000}
                />
                <div className="flex justify-between mt-1">
                  {formik.errors.content && formik.touched.content && (
                    <p className="text-xs text-red-500">{formik.errors.content}</p>
                  )}
                  <p className="text-xs text-slate-400 ml-auto">
                    {formik.values.content.length}/10000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200">
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isPending}
                variant="outline"
                className="border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {isEditMode ? "Update Post" : "Publish Post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
