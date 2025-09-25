"use client"

import type React from "react"
import { useState } from "react"
import { useFormikContext } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Save, MapPin, Users, DollarSign, CalendarIcon, Plus, X, Camera, Upload } from "lucide-react"
import { useUpdatePackageBasiceDetailsMutations } from "@/hooks/vendor/usePackage"
import { useUploadImagesMutation } from "@/hooks/common/useUploadImages"
import ConfirmationModal from "@/components/modals/ConfirmationModal"
import toast from "react-hot-toast"
import type { FormValues } from "./EditPackage"

interface BasicDetailsFormProps {
  packageId: string
}

export function BasicDetailsForm({ packageId }: BasicDetailsFormProps) {
   const { 
    values, 
    setFieldValue, 
    errors, 
    touched, 
    dirty,
    validateForm,
    setTouched,
  } = useFormikContext<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")

  const { mutate: updateBasiceDetails } = useUpdatePackageBasiceDetailsMutations()
  const { mutateAsync: uploadImages } = useUploadImagesMutation()

  const basicDetails = values.basicDetails

  console.log(values.basicDetails.category,"---> basicdetails")

  const handleSaveClick = async () => {
    // Trigger validation and mark all fields as touched
    const validationErrors = await validateForm();

    // Mark all basic details fields as touched to show validation errors
    setTouched({
      basicDetails: {
        packageName: true,
        title: true,
        description: true,
        category: true,
        maxGroupSize: true,
        price: true,
        meetingPoint: true,
        startDate: true,
        endDate: true,
        cancellationPolicy: true,
        termsAndConditions: true,
        images: true,
      },
    })

    if (validationErrors?.basicDetails) {
      toast.error("Please fix the validation errors before saving")
      return
    }

    setShowConfirmModal(true)
  }

  const handleBasicDetailsSubmit = async () => {
    setIsSubmitting(true)
    setShowConfirmModal(false)

    try {
      let finalImageUrls: string[] = []

      // Process images - separate new files from existing URLs
      if (basicDetails.images && basicDetails.images.length > 0) {
        const existingUrls: string[] = []
        const newFiles: File[] = []

        basicDetails.images.forEach((image: any) => {
          if (typeof image === "string") {
            existingUrls.push(image)
          } else if (image instanceof File) {
            newFiles.push(image)
          }
        })

        // Upload new files if any
        let uploadedUrls: string[] = []
        if (newFiles.length > 0) {
          try {
            const uploadResult = await uploadImages(newFiles)
            if (uploadResult && uploadResult.length > 0) {
              uploadedUrls = uploadResult.map((img) => img.url)
            } else {
              throw new Error("Image upload failed - no URLs returned")
            }
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError)
            throw new Error(
              `Image upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
            )
          }
        }

        finalImageUrls = [...existingUrls, ...uploadedUrls]
      }

      const basicData = {
        packageName: basicDetails.packageName,
        title: basicDetails.title,
        description: basicDetails.description,
        category: basicDetails.category,
        tags: basicDetails.tags,
        meetingPoint: basicDetails.meetingPoint,
        maxGroupSize: basicDetails.maxGroupSize,
        minGroupSize : basicDetails.minGroupSize,
        price: basicDetails.price,
        startDate: basicDetails.startDate,
        endDate: basicDetails.endDate,
        duration: basicDetails.duration,
        inclusions: basicDetails.inclusions,
        exclusions: basicDetails.exclusions,
        cancellationPolicy: basicDetails.cancellationPolicy,
        termsAndConditions: basicDetails.termsAndConditions,
        images: finalImageUrls,
      }

      updateBasiceDetails(
        { packageId, basicData },
        {
          onSuccess: (response) => {
            toast.success(response?.message)
            setIsSubmitting(false)
          },
          onError: (error: any) => {
            console.error("Failed to update package:", error)
            toast.error(error?.response?.data.message)
            setIsSubmitting(false)
          },
        },
      )
    } catch (error) {
      console.error("Error updating basic details:", error)
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const currentImages = basicDetails.images || []
    setFieldValue("basicDetails.images", [...currentImages, ...files])
  }

  const removeImage = (imageIndex: number) => {
    const currentImages = basicDetails.images || []
    setFieldValue(
      "basicDetails.images",
      currentImages.filter((_: any, index: number) => index !== imageIndex),
    )
  }

  const addTag = () => {
    if (newTag.trim() && !basicDetails.tags?.includes(newTag.trim())) {
      setFieldValue("basicDetails.tags", [...(basicDetails.tags || []), newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFieldValue("basicDetails.tags", basicDetails.tags?.filter((tag: string) => tag !== tagToRemove) || [])
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFieldValue("basicDetails.inclusions", [...(basicDetails.inclusions || []), newInclusion.trim()])
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFieldValue("basicDetails.inclusions", basicDetails.inclusions?.filter((_: any, i: number) => i !== index) || [])
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFieldValue("basicDetails.exclusions", [...(basicDetails.exclusions || []), newExclusion.trim()])
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFieldValue("basicDetails.exclusions", basicDetails.exclusions?.filter((_: any, i: number) => i !== index) || [])
  }

  const SaveConfirmationModal = () => {
    const hasNewImages = basicDetails.images?.some((img: any) => img instanceof File) || false
    const newImagesCount = basicDetails.images?.filter((img: any) => img instanceof File).length || 0

    const getModalMessage = () => {
      let message = "Are you sure you want to save these changes? "
      if (hasNewImages) {
        message += `This will upload ${newImagesCount} new image${newImagesCount > 1 ? "s" : ""} and update your package information.`
      }
      return message
    }

    const getConfirmText = () => {
      if (hasNewImages && newImagesCount > 0) {
        return `Upload ${newImagesCount} Image${newImagesCount > 1 ? "s" : ""} & Save`
      }
      return "Save Changes"
    }

    return (
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => !isSubmitting && setShowConfirmModal(false)}
        onConfirm={handleBasicDetailsSubmit}
        title="Save Basic Details"
        message={getModalMessage()}
        confirmText={getConfirmText()}
        cancelText="Cancel"
        type="info"
        isLoading={isSubmitting}
      />
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#1a5f6b]">Package Basic Information</h3>
        <Button
          onClick={handleSaveClick}
          disabled={isSubmitting}
          className="bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white w-full sm:w-auto disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {basicDetails.images?.some((img: any) => img instanceof File) ? "Uploading Images..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Basic Details
              {dirty && <span className="ml-2 text-xs">•</span>}
            </>
          )}
        </Button>
      </div>

      {/* Basic Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="packageName">Package Name *</Label>
          <Input
            id="packageName"
            value={basicDetails.packageName || ""}
            onChange={(e) => setFieldValue("basicDetails.packageName", e.target.value)}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.packageName && errors.basicDetails?.packageName && "border-red-500",
            )}
          />
          {touched.basicDetails?.packageName && errors.basicDetails?.packageName && (
            <p className="text-red-500 text-sm">{errors.basicDetails.packageName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={basicDetails.title || ""}
            onChange={(e) => setFieldValue("basicDetails.title", e.target.value)}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.title && errors.basicDetails?.title && "border-red-500",
            )}
          />
          {touched.basicDetails?.title && errors.basicDetails?.title && (
            <p className="text-red-500 text-sm">{errors.basicDetails.title}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={basicDetails.description || ""}
          onChange={(e) => setFieldValue("basicDetails.description", e.target.value)}
          rows={4}
          className={cn(
            "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
            touched.basicDetails?.description && errors.basicDetails?.description && "border-red-500",
          )}
        />
        {touched.basicDetails?.description && errors.basicDetails?.description && (
          <p className="text-red-500 text-sm">{errors.basicDetails.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={basicDetails.category || ""}
            onValueChange={(value) => setFieldValue("basicDetails.category", value)}
          >
            <SelectTrigger
              className={cn(
                "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
                touched.basicDetails?.category && errors.basicDetails?.category && "border-red-500",
              )}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="beach">Beach</SelectItem>
              <SelectItem value="mountain">Mountain</SelectItem>
              <SelectItem value="wildlife">Wildlife</SelectItem>
              <SelectItem value="heritage">Heritage</SelectItem>
            </SelectContent>
          </Select>
          {touched.basicDetails?.category && errors.basicDetails?.category && (
            <p className="text-red-500 text-sm">{errors.basicDetails.category}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#2CA4BC]" />
            Max Group Size *
          </Label>
          <Input
            type="number"
            min="1"
            value={basicDetails.maxGroupSize || 1}
            onChange={(e) => setFieldValue("basicDetails.maxGroupSize", Number.parseInt(e.target.value) || 1)}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.maxGroupSize && errors.basicDetails?.maxGroupSize && "border-red-500",
            )}
          />
          {touched.basicDetails?.maxGroupSize && errors.basicDetails?.maxGroupSize && (
            <p className="text-red-500 text-sm">{errors.basicDetails.maxGroupSize}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#2CA4BC]" />
            Min Group Size *
          </Label>
          <Input
            type="number"
            min="1"
            value={basicDetails.minGroupSize || 1}
            onChange={(e) => setFieldValue("basicDetails.minGroupSize", Number.parseInt(e.target.value) || 1)}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.minGroupSize && errors.basicDetails?.minGroupSize && "border-red-500",
            )}
          />
          {touched.basicDetails?.minGroupSize && errors.basicDetails?.minGroupSize && (
            <p className="text-red-500 text-sm">{errors.basicDetails.minGroupSize}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#2CA4BC]" />
            Price (₹) *
          </Label>
          <Input
            type="number"
            min="0"
            value={basicDetails.price || 0}
            onChange={(e) => setFieldValue("basicDetails.price", Number.parseFloat(e.target.value) || 0)}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.price && errors.basicDetails?.price && "border-red-500",
            )}
          />
          {touched.basicDetails?.price && errors.basicDetails?.price && (
            <p className="text-red-500 text-sm">{errors.basicDetails.price}</p>
          )}
        </div>
      </div>

      {/* Package Images */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-[#2CA4BC]" />
          Package Images *
        </Label>
        <div
          className={cn(
            "border-2 border-dashed border-[#2CA4BC]/30 rounded-xl p-6 sm:p-8 text-center hover:border-[#2CA4BC]/50 transition-colors",
            touched.basicDetails?.images && errors.basicDetails?.images && "border-red-500",
          )}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-12 sm:h-16 w-12 sm:w-16 text-[#2CA4BC] mx-auto mb-4" />
            <p className="text-[#1a5f6b] font-medium text-sm sm:text-lg">Click to upload images</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each • Minimum 1 image required</p>
          </label>
        </div>
        {touched.basicDetails?.images && errors.basicDetails?.images && (
          <p className="text-red-500 text-sm">{errors.basicDetails.images}</p>
        )}
        {basicDetails.images && basicDetails.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {basicDetails.images.map((image: any, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={typeof image === "string" ? image : URL.createObjectURL(image)}
                  alt={`Package ${index + 1}`}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full shadow-lg"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            onKeyPress={(e) => e.key === "Enter" && addTag()}
          />
          <Button type="button" onClick={addTag} size="sm" className="bg-[#2CA4BC] hover:bg-[#1a5f6b] shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {basicDetails.tags?.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#2CA4BC]/10 text-[#1a5f6b] hover:bg-[#2CA4BC]/20 pr-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-5 w-5 p-0 ml-1 hover:bg-red-100 hover:text-red-600 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Meeting Point */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2CA4BC]" />
          Meeting Point *
        </Label>
        <Input
          value={basicDetails.meetingPoint || ""}
          onChange={(e) => setFieldValue("basicDetails.meetingPoint", e.target.value)}
          className={cn(
            "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
            touched.basicDetails?.meetingPoint && errors.basicDetails?.meetingPoint && "border-red-500",
          )}
        />
        {touched.basicDetails?.meetingPoint && errors.basicDetails?.meetingPoint && (
          <p className="text-red-500 text-sm">{errors.basicDetails.meetingPoint}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !basicDetails.startDate && "text-muted-foreground",
                  touched.basicDetails?.startDate && errors.basicDetails?.startDate && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {basicDetails.startDate ? format(basicDetails.startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={basicDetails.startDate || undefined}
                onSelect={(date) => setFieldValue("basicDetails.startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {touched.basicDetails?.startDate && errors.basicDetails?.startDate && (
            <p className="text-red-500 text-sm">{errors.basicDetails.startDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !basicDetails.endDate && "text-muted-foreground",
                  touched.basicDetails?.endDate && errors.basicDetails?.endDate && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {basicDetails.endDate ? format(basicDetails.endDate, "PPP") : "Pick end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={basicDetails.endDate || undefined}
                onSelect={(date) => setFieldValue("basicDetails.endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {touched.basicDetails?.endDate && errors.basicDetails?.endDate && (
            <p className="text-red-500 text-sm">{errors.basicDetails.endDate}</p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {basicDetails.duration && (
        <div className="p-4 bg-[#2CA4BC]/10 rounded-lg border border-[#2CA4BC]/20">
          <p className="text-sm font-medium text-[#1a5f6b]">
            Duration: {basicDetails.duration.days} Days / {basicDetails.duration.nights} Nights
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Itinerary will be automatically updated with {basicDetails.duration.days} days
          </p>
        </div>
      )}

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="text-green-700 font-medium">What's Included</Label>
          <div className="flex gap-2">
            <Input
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              placeholder="Add inclusion"
              className="focus:border-green-400 focus:ring-green-400"
              onKeyPress={(e) => e.key === "Enter" && addInclusion()}
            />
            <Button type="button" onClick={addInclusion} size="sm" className="bg-green-600 hover:bg-green-700 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {basicDetails.inclusions?.map((inclusion: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <span className="text-sm text-green-800 flex-1 mr-2">{inclusion}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-green-600 hover:text-red-600 transition-colors shrink-0"
                  onClick={() => removeInclusion(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-red-700 font-medium">What's Not Included</Label>
          <div className="flex gap-2">
            <Input
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              placeholder="Add exclusion"
              className="focus:border-red-400 focus:ring-red-400"
              onKeyPress={(e) => e.key === "Enter" && addExclusion()}
            />
            <Button type="button" onClick={addExclusion} size="sm" className="bg-red-600 hover:bg-red-700 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {basicDetails.exclusions?.map((exclusion: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <span className="text-sm text-red-800 flex-1 mr-2">{exclusion}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-700 transition-colors shrink-0"
                  onClick={() => removeExclusion(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cancellationPolicy">Cancellation Policy *</Label>
          <Textarea
            id="cancellationPolicy"
            value={basicDetails.cancellationPolicy || ""}
            onChange={(e) => setFieldValue("basicDetails.cancellationPolicy", e.target.value)}
            rows={4}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.cancellationPolicy && errors.basicDetails?.cancellationPolicy && "border-red-500",
            )}
          />
          {touched.basicDetails?.cancellationPolicy && errors.basicDetails?.cancellationPolicy && (
            <p className="text-red-500 text-sm">{errors.basicDetails.cancellationPolicy}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">Terms & Conditions *</Label>
          <Textarea
            id="termsAndConditions"
            value={basicDetails.termsAndConditions || ""}
            onChange={(e) => setFieldValue("basicDetails.termsAndConditions", e.target.value)}
            rows={4}
            className={cn(
              "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
              touched.basicDetails?.termsAndConditions && errors.basicDetails?.termsAndConditions && "border-red-500",
            )}
          />
          {touched.basicDetails?.termsAndConditions && errors.basicDetails?.termsAndConditions && (
            <p className="text-red-500 text-sm">{errors.basicDetails.termsAndConditions}</p>
          )}
        </div>
      </div>

      <SaveConfirmationModal />
    </div>
  )
}
