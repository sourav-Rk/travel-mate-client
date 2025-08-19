"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import {
  CalendarIcon,
  Plus,
  Camera,
  ArrowLeft,
  Save,
  X,
  Upload,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
  Utensils,
  Car,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PackageFormData {
  packageName: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  meetingPoint: string
  images: File[]
  maxGroupSize: number
  price: number
  cancellationPolicy: string
  termsAndConditions: string
  startDate: Date | null
  endDate: Date | null
  duration: { days: number; nights: number }
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    days: Array<{
      dayNumber: number
      title: string
      description: string
      accommodation: string
      transfers: string[]
      meals: { breakfast: boolean; lunch: boolean; dinner: boolean }
      activities: any[]
    }>
  }
}

export default function AddPackageForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newTransfer, setNewTransfer] = useState("")

  const [formData, setFormData] = useState<PackageFormData>({
    packageName: "",
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: [],
    meetingPoint: "",
    images: [],
    maxGroupSize: 1,
    price: 0,
    cancellationPolicy: "",
    termsAndConditions: "",
    startDate: null,
    endDate: null,
    duration: { days: 1, nights: 0 },
    inclusions: [],
    exclusions: [],
    itinerary: { days: [createNewDay(1)] },
  })

  // Auto-generate slug from package name
  useEffect(() => {
    if (formData.packageName) {
      const slug = formData.packageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.packageName])

  // Auto-calculate duration from dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = differenceInDays(formData.endDate, formData.startDate) + 1
      const nights = Math.max(0, days - 1)
      setFormData((prev) => ({
        ...prev,
        duration: { days, nights },
        itinerary: {
          days: Array.from({ length: days }, (_, i) => prev.itinerary.days[i] || createNewDay(i + 1)),
        },
      }))
    }
  }, [formData.startDate, formData.endDate])

  function createNewDay(dayNumber: number) {
    return {
      dayNumber,
      title: "",
      description: "",
      accommodation: "",
      transfers: [],
      meals: { breakfast: false, lunch: false, dinner: false },
      activities: [],
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    console.log("Removing tag:", tagToRemove) // Debug log
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData((prev) => ({ ...prev, inclusions: [...prev.inclusions, newInclusion.trim()] }))
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, newExclusion.trim()] }))
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }))
  }

  const addTransfer = (dayIndex: number) => {
    if (newTransfer.trim()) {
      const updatedDays = [...formData.itinerary.days]
      updatedDays[dayIndex].transfers.push(newTransfer.trim())
      setFormData((prev) => ({ ...prev, itinerary: { days: updatedDays } }))
      setNewTransfer("")
    }
  }

  const removeTransfer = (dayIndex: number, transferIndex: number) => {
    console.log("Removing transfer:", dayIndex, transferIndex) // Debug log
    setFormData((prev) => {
      const newDays = [...prev.itinerary.days]
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        transfers: newDays[dayIndex].transfers.filter((_, index) => index !== transferIndex),
      }
      return {
        ...prev,
        itinerary: { days: newDays },
      }
    })
  }

  const addActivity = (dayIndex: number) => {
    const newActivity = {
      name: "",
      dayNumber: dayIndex + 1,
      description: "",
      duration: "",
      category: "",
      priceIncluded: false,
    }
    const updatedDays = [...formData.itinerary.days]
    updatedDays[dayIndex].activities.push(newActivity)
    setFormData((prev) => ({ ...prev, itinerary: { days: updatedDays } }))
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: any) => {
    const updatedDays = [...formData.itinerary.days]
    updatedDays[dayIndex].activities[activityIndex] = {
      ...updatedDays[dayIndex].activities[activityIndex],
      [field]: value,
    }
    setFormData((prev) => ({ ...prev, itinerary: { days: updatedDays } }))
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...formData.itinerary.days]
    updatedDays[dayIndex].activities.splice(activityIndex, 1)
    setFormData((prev) => ({ ...prev, itinerary: { days: updatedDays } }))
  }

  const updateDay = (dayIndex: number, field: string, value: any) => {
    const updatedDays = [...formData.itinerary.days]
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value }
    setFormData((prev) => ({ ...prev, itinerary: { days: updatedDays } }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeImage = (imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      console.log("Submitting package data:", formData)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      navigate("/vendor/packages")
    } catch (error) {
      console.error("Error submitting package:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { title: "Package Details", description: "Basic information and pricing", icon: FileText },
    { title: "Itinerary", description: "Daily activities and schedule", icon: Utensils },
    { title: "Final Review", description: "Review and submit package", icon: Upload },
  ]

  const renderPackageDetails = () => (
    <div className="space-y-8">
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
              value={formData.packageName}
              onChange={(e) => setFormData((prev) => ({ ...prev, packageName: e.target.value }))}
              placeholder="Amazing Kerala Adventure"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Discover the Beauty of Kerala"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="slug">URL Slug (Auto-generated)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
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
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed package description..."
            rows={4}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
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
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2CA4BC]" />
              Max Group Size *
            </Label>
            <Input
              type="number"
              min="1"
              value={formData.maxGroupSize}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxGroupSize: Number.parseInt(e.target.value) || 1 }))}
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#2CA4BC]" />
              Price (₹) *
            </Label>
            <Input
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag (e.g., family-friendly, adventure)"
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            onKeyPress={(e) => e.key === "Enter" && addTag()}
          />
          <Button type="button" onClick={addTag} size="sm" className="bg-[#2CA4BC] hover:bg-[#1a5f6b]">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
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

      {/* Dates & Duration */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-[#2CA4BC]/20">
        <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#2CA4BC]" />
          Schedule & Duration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate || undefined}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate || undefined}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Duration (Auto-calculated)</Label>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#1a5f6b]">
                {formData.duration.days} Days / {formData.duration.nights} Nights
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Point */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2CA4BC]" />
          Meeting Point *
        </Label>
        <Input
          value={formData.meetingPoint}
          onChange={(e) => setFormData((prev) => ({ ...prev, meetingPoint: e.target.value }))}
          placeholder="Kochi International Airport, Terminal 3"
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
        />
      </div>

      {/* Package Images */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-[#2CA4BC]" />
          Package Images *
        </Label>
        <div className="border-2 border-dashed border-[#2CA4BC]/30 rounded-xl p-8 text-center hover:border-[#2CA4BC]/50 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Camera className="h-16 w-16 text-[#2CA4BC] mx-auto mb-4" />
            <p className="text-[#1a5f6b] font-medium text-lg">Click to upload images</p>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each • Minimum 3 images recommended</p>
          </label>
        </div>
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Package ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full shadow-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="text-green-700 font-medium">What's Included</Label>
          <div className="flex gap-2">
            <Input
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              placeholder="e.g., Accommodation, Meals, Transport"
              className="focus:border-green-400 focus:ring-green-400"
              onKeyPress={(e) => e.key === "Enter" && addInclusion()}
            />
            <Button type="button" onClick={addInclusion} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {formData.inclusions.map((inclusion, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <span className="text-sm text-green-800">{inclusion}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-green-600 hover:text-red-600 transition-colors"
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
              placeholder="e.g., Personal expenses, Tips"
              className="focus:border-red-400 focus:ring-red-400"
              onKeyPress={(e) => e.key === "Enter" && addExclusion()}
            />
            <Button type="button" onClick={addExclusion} size="sm" className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {formData.exclusions.map((exclusion, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <span className="text-sm text-red-800">{exclusion}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-700 transition-colors"
                  onClick={() => removeExclusion(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cancellationPolicy">Cancellation Policy *</Label>
          <Textarea
            id="cancellationPolicy"
            value={formData.cancellationPolicy}
            onChange={(e) => setFormData((prev) => ({ ...prev, cancellationPolicy: e.target.value }))}
            placeholder="Free cancellation up to 24 hours before the tour..."
            rows={4}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="termsAndConditions">Terms & Conditions *</Label>
          <Textarea
            id="termsAndConditions"
            value={formData.termsAndConditions}
            onChange={(e) => setFormData((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
            placeholder="Terms and conditions for this package..."
            rows={4}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
        </div>
      </div>
    </div>
  )

  const renderItinerary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#1a5f6b] mb-2">Plan Your Itinerary</h3>
        <p className="text-gray-600">Create detailed daily schedules for your {formData.duration.days}-day package</p>
      </div>

      {formData.itinerary.days.map((day, dayIndex) => (
        <Card key={dayIndex} className="border-[#2CA4BC]/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg">
                {day.dayNumber}
              </div>
              Day {day.dayNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Day Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day Title *</Label>
                <Input
                  value={day.title}
                  onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                  placeholder="Arrival in Kochi & City Tour"
                  className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                />
              </div>
              <div className="space-y-2">
                <Label>Accommodation</Label>
                <Input
                  value={day.accommodation}
                  onChange={(e) => updateDay(dayIndex, "accommodation", e.target.value)}
                  placeholder="Hotel Grand Plaza or similar"
                  className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Day Description *</Label>
              <Textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                placeholder="Detailed description of the day's activities..."
                rows={3}
                className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
              />
            </div>

            {/* Transfers */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Car className="h-4 w-4 text-[#2CA4BC]" />
                Transfers
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newTransfer}
                  onChange={(e) => setNewTransfer(e.target.value)}
                  placeholder="e.g., Airport to Hotel, Hotel to Backwaters"
                  className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                  onKeyPress={(e) => e.key === "Enter" && addTransfer(dayIndex)}
                />
                <Button
                  type="button"
                  onClick={() => addTransfer(dayIndex)}
                  size="sm"
                  className="bg-[#2CA4BC] hover:bg-[#1a5f6b]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.transfers.map((transfer, transferIndex) => (
                  <Badge key={transferIndex} variant="outline" className="border-[#2CA4BC]/30 text-[#1a5f6b] pr-1">
                    <Car className="h-3 w-3 mr-1" />
                    {transfer}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTransfer(dayIndex, transferIndex)}
                      className="h-5 w-5 p-0 ml-1 hover:bg-red-100 hover:text-red-600 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-[#2CA4BC]" />
                Meals Included
              </Label>
              <div className="flex gap-6">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${dayIndex}-${meal}`}
                      checked={day.meals[meal as keyof typeof day.meals]}
                      onCheckedChange={(checked) => updateDay(dayIndex, "meals", { ...day.meals, [meal]: checked })}
                      className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
                    />
                    <Label htmlFor={`${dayIndex}-${meal}`} className="capitalize font-medium">
                      {meal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-[#2CA4BC]" />
                  Activities
                </Label>
                <Button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  size="sm"
                  className="bg-[#2CA4BC] hover:bg-[#1a5f6b]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              {day.activities.map((activity, activityIndex) => (
                <Card key={activityIndex} className="border-gray-200 bg-gray-50">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-[#1a5f6b]">Activity {activityIndex + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Activity Name *</Label>
                        <Input
                          value={activity.name}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, "name", e.target.value)}
                          placeholder="Backwater Cruise"
                          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-[#2CA4BC]" />
                          Duration
                        </Label>
                        <Input
                          value={activity.duration}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, "duration", e.target.value)}
                          placeholder="2 hours"
                          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Activity Description</Label>
                      <Textarea
                        value={activity.description}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, "description", e.target.value)}
                        placeholder="Enjoy a peaceful cruise through the backwaters..."
                        rows={2}
                        className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={activity.category}
                          onValueChange={(value) => updateActivity(dayIndex, activityIndex, "category", value)}
                        >
                          <SelectTrigger className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sightseeing">Sightseeing</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="nature">Nature</SelectItem>
                            <SelectItem value="water-sports">Water Sports</SelectItem>
                            <SelectItem value="food">Food & Dining</SelectItem>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="relaxation">Relaxation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id={`activity-${dayIndex}-${activityIndex}-price`}
                          checked={activity.priceIncluded}
                          onCheckedChange={(checked) =>
                            updateActivity(dayIndex, activityIndex, "priceIncluded", checked)
                          }
                          className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
                        />
                        <Label htmlFor={`activity-${dayIndex}-${activityIndex}-price`} className="font-medium">
                          Price Included in Package
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderFinalReview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#1a5f6b] mb-2">Review Your Package</h3>
        <p className="text-gray-600">Please review all details before submitting</p>
      </div>

      {/* Package Summary */}
      <Card className="border-[#2CA4BC]/20">
        <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
          <CardTitle className="text-[#1a5f6b]">Package Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <strong>Package Name:</strong> {formData.packageName}
              </div>
              <div>
                <strong>Title:</strong> {formData.title}
              </div>
              <div>
                <strong>Category:</strong> {formData.category}
              </div>
              <div>
                <strong>Duration:</strong> {formData.duration.days} Days / {formData.duration.nights} Nights
              </div>
              <div>
                <strong>Max Group Size:</strong> {formData.maxGroupSize} people
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <strong>Price:</strong> ₹{formData.price.toLocaleString()}
              </div>
              <div>
                <strong>Meeting Point:</strong> {formData.meetingPoint}
              </div>
              <div>
                <strong>Images:</strong> {formData.images.length} uploaded
              </div>
              <div>
                <strong>Inclusions:</strong> {formData.inclusions.length} items
              </div>
              <div>
                <strong>Exclusions:</strong> {formData.exclusions.length} items
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Summary */}
      <Card className="border-[#2CA4BC]/20">
        <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
          <CardTitle className="text-[#1a5f6b]">Itinerary Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {formData.itinerary.days.map((day, index) => (
              <div key={index} className="border-l-4 border-[#2CA4BC] pl-4">
                <h4 className="font-semibold text-[#1a5f6b]">
                  Day {day.dayNumber}: {day.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{day.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">🏨 {day.accommodation || "No accommodation"}</Badge>
                  <Badge variant="outline">🚗 {day.transfers.length} transfers</Badge>
                  <Badge variant="outline">🍽️ {Object.values(day.meals).filter(Boolean).length} meals</Badge>
                  <Badge variant="outline">🎯 {day.activities.length} activities</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="text-green-800">
            <h4 className="font-semibold mb-2">Ready to Create Package?</h4>
            <p className="text-sm">
              Once submitted, your package will be reviewed and published to the platform. You can edit it later from
              your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 to-[#1a5f6b]/5">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white p-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold">Create New Package</CardTitle>
              <CardDescription className="text-white/90 text-lg mt-2">{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Enhanced Step Indicator */}
          <div className="flex justify-center items-center gap-8 mb-12">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg",
                        currentStep === index
                          ? "bg-[#2CA4BC] text-white scale-110"
                          : currentStep > index
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                      )}
                    >
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <span
                      className={cn(
                        "mt-3 text-sm font-semibold text-center transition-colors",
                        currentStep === index ? "text-[#2CA4BC]" : "text-gray-500",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 rounded-full transition-all duration-300",
                        currentStep > index ? "bg-green-500" : "bg-gray-300",
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Form Content */}
          <div className="min-h-[600px]">
            {currentStep === 0 && renderPackageDetails()}
            {currentStep === 1 && renderItinerary()}
            {currentStep === 2 && renderFinalReview()}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 px-8 py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="ml-auto bg-[#2CA4BC] hover:bg-[#1a5f6b] px-8 py-3 text-lg"
            >
              Next Step
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 px-8 py-3 text-lg shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Creating Package...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-3" />
                  Create Package
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
