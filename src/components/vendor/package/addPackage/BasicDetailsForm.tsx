"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useFormikContext } from "formik"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {  differenceInDays } from "date-fns"
import {  MapPin, Users, DollarSign, FileText } from "lucide-react"
import ImageUploadSection from "./ImageUploadSection"
import InclusionsExclusionsSection from "./InclusionsExclusionsSection"
import PoliciesSection from "./PoliciesSection"
import DateDurationSection from "./DateDurationSection"
import TagsSection from "./TagSection";
import type { BasicDetails } from "@/types/packageType"


interface FormValues {
  basicDetails: BasicDetails;
}

interface BasicDetailsFormProps {
  className?: string
}

export function BasicDetailsForm({ className }: BasicDetailsFormProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<FormValues>();
  const [newTag, setNewTag] = useState("")

  // Auto-generate slug from package name
  useEffect(() => {
    if (values.basicDetails?.packageName) {
      const slug = values.basicDetails.packageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFieldValue("basicDetails.slug", slug)
    }
  }, [values.basicDetails?.packageName, setFieldValue])

  // Auto-calculate duration from dates
  useEffect(() => {
    if (values.basicDetails?.startDate && values.basicDetails?.endDate) {
      const days = differenceInDays(values.basicDetails.endDate, values.basicDetails.startDate) + 1
      const nights = Math.max(0, days - 1)
      setFieldValue("basicDetails.duration", { days, nights })
    }
  }, [values.basicDetails?.startDate, values.basicDetails?.endDate, setFieldValue])

  const addTag = () => {
    if (newTag.trim() && !values.basicDetails?.tags?.includes(newTag.trim())) {
      const currentTags = values.basicDetails?.tags || []
      setFieldValue("basicDetails.tags", [...currentTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = values.basicDetails?.tags || []
    setFieldValue(
      "basicDetails.tags",
      currentTags.filter((tag: string) => tag !== tagToRemove),
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const currentImages = values.basicDetails?.images || []
    setFieldValue("basicDetails.images", [...currentImages, ...files])
  }

  const removeImage = (imageIndex: number) => {
    const currentImages = values.basicDetails?.images || []
    setFieldValue(
      "basicDetails.images",
      currentImages.filter((_: any, index: number) => index !== imageIndex),
    )
  }

  const addInclusion = (newInclusion: string) => {
    if (newInclusion.trim()) {
      const currentInclusions = values.basicDetails?.inclusions || []
      setFieldValue("basicDetails.inclusions", [...currentInclusions, newInclusion.trim()])
    }
  }

  const removeInclusion = (index: number) => {
    const currentInclusions = values.basicDetails?.inclusions || []
    setFieldValue(
      "basicDetails.inclusions",
      currentInclusions.filter((_: any, i: number) => i !== index),
    )
  }

  const addExclusion = (newExclusion: string) => {
    if (newExclusion.trim()) {
      const currentExclusions = values.basicDetails?.exclusions || []
      setFieldValue("basicDetails.exclusions", [...currentExclusions, newExclusion.trim()])
    }
  }

  const removeExclusion = (index: number) => {
    const currentExclusions = values.basicDetails?.exclusions || []
    setFieldValue(
      "basicDetails.exclusions",
      currentExclusions.filter((_: any, i: number) => i !== index),
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Basic Information */}
      <div className="bg-gradient-to-r from-[#2CA4BC]/5 to-[#1a5f6b]/5 p-6 rounded-xl border border-[#2CA4BC]/20">
        <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#2CA4BC]" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageName">Package Name *</Label>
            <Input
              id="packageName"
              value={values.basicDetails?.packageName || ""}
              onChange={(e) => setFieldValue("basicDetails.packageName", e.target.value)}
              placeholder="Amazing Kerala Adventure"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.basicDetails?.packageName && errors.basicDetails?.packageName && (
              <p className="text-red-500 text-sm">{errors.basicDetails.packageName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={values.basicDetails?.title || ""}
              onChange={(e) => setFieldValue("basicDetails.title", e.target.value)}
              placeholder="Discover the Beauty of Kerala"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.basicDetails?.title && errors.basicDetails?.title && (
              <p className="text-red-500 text-sm">{errors.basicDetails.title}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="slug">URL Slug (Auto-generated)</Label>
            <Input
              id="slug"
              value={values.basicDetails?.slug || ""}
              onChange={(e) => setFieldValue("basicDetails.slug", e.target.value)}
              placeholder="amazing-kerala-adventure"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC] bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Description & Category */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={values.basicDetails?.description || ""}
            onChange={(e) => setFieldValue("basicDetails.description", e.target.value)}
            placeholder="Detailed package description..."
            rows={4}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
          {touched.basicDetails?.description && errors.basicDetails?.description && (
            <p className="text-red-500 text-sm">{errors.basicDetails.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={values.basicDetails?.category || ""}
              onValueChange={(value) => setFieldValue("basicDetails.category", value)}
            >
              <SelectTrigger className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
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
              value={values.basicDetails?.maxGroupSize || 1}
              onChange={(e) => setFieldValue("basicDetails.maxGroupSize", Number.parseInt(e.target.value) || 10)}
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.basicDetails?.maxGroupSize && errors.basicDetails?.maxGroupSize && (
              <p className="text-red-500 text-sm">{errors.basicDetails.maxGroupSize}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#2CA4BC]" />
              Price (₹) *
            </Label>
            <Input
              type="number"
              min="500"
              value={values.basicDetails?.price || 500}
              onChange={(e) => setFieldValue("basicDetails.price", Number.parseFloat(e.target.value) || 0)}
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.basicDetails?.price && errors.basicDetails?.price && (
              <p className="text-red-500 text-sm">{errors.basicDetails.price}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <TagsSection
        tags={values.basicDetails?.tags || []}
        newTag={newTag}
        setNewTag={setNewTag}
        addTag={addTag}
        removeTag={removeTag}
        error={touched.basicDetails?.tags && errors.basicDetails?.tags}
      />

      {/* Dates & Duration */}
      <DateDurationSection
        startDate={values.basicDetails?.startDate}
        endDate={values.basicDetails?.endDate}
        duration={values.basicDetails?.duration}
        setFieldValue={setFieldValue}
        errors={errors}
        touched={touched}
      />

      {/* Meeting Point */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2CA4BC]" />
          Meeting Point *
        </Label>
        <Input
          value={values.basicDetails?.meetingPoint || ""}
          onChange={(e) => setFieldValue("basicDetails.meetingPoint", e.target.value)}
          placeholder="Kochi International Airport, Terminal 3"
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
        />
        {touched.basicDetails?.meetingPoint && errors.basicDetails?.meetingPoint && (
          <p className="text-red-500 text-sm">{errors.basicDetails.meetingPoint}</p>
        )}
      </div>

      {/* Package Images */}
      <ImageUploadSection
        images={values.basicDetails?.images || []}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        error={touched.basicDetails?.images && errors.basicDetails?.images}
      />

      {/* Inclusions & Exclusions */}
      <InclusionsExclusionsSection
        inclusions={values.basicDetails?.inclusions || []}
        exclusions={values.basicDetails?.exclusions || []}
        addInclusion={addInclusion}
        removeInclusion={removeInclusion}
        addExclusion={addExclusion}
        removeExclusion={removeExclusion}
      />

      {/* Policies */}
      <PoliciesSection
        cancellationPolicy={values.basicDetails?.cancellationPolicy || ""}
        termsAndConditions={values.basicDetails?.termsAndConditions || ""}
        setFieldValue={setFieldValue}
        errors={errors}
        touched={touched}
      />
    </div>
  )
}
