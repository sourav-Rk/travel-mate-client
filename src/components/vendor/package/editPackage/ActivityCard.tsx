"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Trash2, Save, Plus, X } from "lucide-react"

interface ActivityCardProps {
  activity: any
  activityIndex?: number
  activityKey?: string
  dayIndex: number
  dayNumber?: number
  isExisting: boolean
  isSubmitting?: boolean
  isSaving?: boolean
  errors?: any
  touched?: any
  onUpdate?: (dayIndex: number, activityIndex: number, activityData: any) => void
  onDelete?: (dayNumber: number, activityId: string, dayIndex: number, activityIndex: number) => void
  onSave?: (dayIndex: number, activityKey: string) => void
  onRemove?: (activityKey: string) => void
  onFieldChange: (field: string, value: any) => void
}

export function ActivityCard({
  activity,
  activityIndex = 0,
  activityKey = "",
  dayIndex,
  dayNumber = 0,
  isExisting,
  isSubmitting = false,
  isSaving = false,
  errors,
  touched,
  onUpdate,
  onDelete,
  onSave,
  onRemove,
  onFieldChange,
}: ActivityCardProps) {
  const handleFieldChange = (field: string, value: any) => {
    onFieldChange(field, value)
  }

  const cardClassName = isExisting ? "border-gray-200 bg-gray-50" : "border-blue-200 bg-blue-50"

  return (
    <Card className={cardClassName}>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-[#1a5f6b]">
              {isExisting ? `Activity ${activityIndex + 1}` : "New Activity"}
            </h4>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isExisting ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isExisting ? "Saved" : "Draft"}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isExisting ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onUpdate?.(dayIndex, activityIndex, activity)}
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1 sm:mr-0" />
                      <span className="sm:hidden">Update</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(dayNumber, activity._id, dayIndex, activityIndex)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Delete</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => onSave?.(dayIndex, activityKey)}
                  className="bg-[#2CA4BC] hover:bg-[#1a5f6b] flex-1 sm:flex-none"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      <span className="hidden sm:inline">Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1 sm:mr-0" />
                      <span className="sm:hidden">Add Activity</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove?.(activityKey)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Remove</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Activity Name *</Label>
            <Input
              value={activity.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
              placeholder="e.g., Backwater Cruise"
            />
            {isExisting &&
              touched?.itinerary?.[dayIndex]?.activityDetails?.[activityIndex]?.name &&
              errors?.itinerary?.[dayIndex]?.activityDetails?.[activityIndex]?.name && (
                <p className="text-red-500 text-sm">{errors.itinerary[dayIndex].activityDetails[activityIndex].name}</p>
              )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-[#2CA4BC]" />
              Duration
            </Label>
            <Input
              value={activity.duration || ""}
              onChange={(e) => handleFieldChange("duration", e.target.value)}
              placeholder="2 hours"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Activity Description</Label>
          <Textarea
            value={activity.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            rows={2}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            placeholder="Enjoy a peaceful cruise through the backwaters..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={activity.category || ""} onValueChange={(value) => handleFieldChange("category", value)}>
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
              id={`${isExisting ? "activity" : "new-activity"}-${dayIndex}-${activityIndex || activityKey}-price`}
              checked={activity.priceIncluded || false}
              onCheckedChange={(checked) => handleFieldChange("priceIncluded", checked)}
              className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
            />
            <Label
              htmlFor={`${isExisting ? "activity" : "new-activity"}-${dayIndex}-${activityIndex || activityKey}-price`}
              className="font-medium text-sm"
            >
              Price Included in Package
            </Label>
          </div>
        </div>

        {!isExisting && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Fill in the activity details and click "Add Activity" to save it to the database.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
