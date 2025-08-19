"use client"

import { useState } from "react"
import { useFormikContext } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Clock, Trash2, Save, X } from "lucide-react"
import { useDeleteActivity, useUpdateActivityMutation, useCreateActivityMutation } from "@/hooks/vendor/usePackage"
import toast from "react-hot-toast"

type ActivitiesFormProps = {
  itineraryId: string
}

interface NewActivity {
  name: string
  description: string
  duration: string
  category: string
  priceIncluded: boolean
}

// Helper type for nested errors
type NestedErrors = {
  [key: string]: any
}

export function ActivitiesForm({ itineraryId }: ActivitiesFormProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newActivities, setNewActivities] = useState<{ [key: string]: NewActivity }>({})
  const [savingActivity, setSavingActivity] = useState<string | null>(null)

  const { mutate: updateActivityData } = useUpdateActivityMutation()
  const { mutate: deleteActivity } = useDeleteActivity()
  const { mutate: addActivityToDb } = useCreateActivityMutation()

  const itineraryDetails = values.itinerary || []

  const getNestedError = (path: (string | number)[]): string | undefined => {
    let current: any = errors
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return undefined
      }
    }
    return typeof current === 'string' ? current : undefined
  }

  const getNestedTouched = (path: (string | number)[]): boolean => {
    let current: any = touched
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return false
      }
    }
    return Boolean(current)
  }

  const handleActivityUpdate = async (dayIndex: number, activityIndex: number, activityData: any) => {
    setIsSubmitting(true)
    updateActivityData(
      { activityId: activityData._id, activityData },
      {
        onSuccess: (response) => {
          toast.success(response?.message)
          const updatedItinerary = [...itineraryDetails]
          updatedItinerary[dayIndex].activityDetails[activityIndex] = response.activity || activityData
          setFieldValue("itinerary", updatedItinerary)
          setIsSubmitting(false)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data.message)
          setIsSubmitting(false)
        },
      },
    )
  }

  const addNewActivityCard = (dayIndex: number) => {
    const newActivityKey = `day-${dayIndex}-new-${Date.now()}`
    setNewActivities((prev) => ({
      ...prev,
      [newActivityKey]: {
        name: "",
        description: "",
        duration: "",
        category: "",
        priceIncluded: false,
      },
    }))
  }

  const removeNewActivityCard = (activityKey: string) => {
    setNewActivities((prev) => {
      const updated = { ...prev }
      delete updated[activityKey]
      return updated
    })
  }

  const updateNewActivity = (activityKey: string, field: string, value: any) => {
    setNewActivities((prev) => ({
      ...prev,
      [activityKey]: {
        ...prev[activityKey],
        [field]: value,
      },
    }))
  }

  const saveNewActivityToDatabase = async (dayIndex: number, activityKey: string) => {
    const activityData = newActivities[activityKey]

    if (!activityData.name.trim()) {
      toast.error("Activity name is required")
      return
    }

    setSavingActivity(activityKey)
    const dayNumber = itineraryDetails[dayIndex].dayNumber

    addActivityToDb(
      {
        itineraryId,
        dayNumber,
        activityData,
      },
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Activity added successfully")

          const updatedItinerary = [...itineraryDetails]
          if (!updatedItinerary[dayIndex].activityDetails) {
            updatedItinerary[dayIndex].activityDetails = []
          }

          const newActivity = {
            ...activityData,
            _id: response.activity?._id || response.activityId,
            ...response.activity,
          }

          updatedItinerary[dayIndex].activityDetails.push(newActivity)
          setFieldValue("itinerary", updatedItinerary)

          removeNewActivityCard(activityKey)
          setSavingActivity(null)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add activity")
          setSavingActivity(null)
        },
      },
    )
  }

  const removeActivityFromDatabase = (
    dayNumber: number,
    activityId: string,
    dayIndex: number,
    activityIndex: number,
  ) => {
    deleteActivity(
      { itineraryId, dayNumber, activityId },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          const updatedItinerary = [...itineraryDetails]
          updatedItinerary[dayIndex].activityDetails.splice(activityIndex, 1)
          setFieldValue("itinerary", updatedItinerary)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to delete activity")
        },
      },
    )
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: any) => {
    const updatedItinerary = [...itineraryDetails]
    if (!updatedItinerary[dayIndex].activityDetails[activityIndex]) {
      updatedItinerary[dayIndex].activityDetails[activityIndex] = {}
    }
    updatedItinerary[dayIndex].activityDetails[activityIndex] = {
      ...updatedItinerary[dayIndex].activityDetails[activityIndex],
      [field]: value,
    }
    setFieldValue("itinerary", updatedItinerary)
  }

  const getNewActivitiesForDay = (dayIndex: number) => {
    return Object.entries(newActivities).filter(([key]) => key.startsWith(`day-${dayIndex}-new-`))
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#1a5f6b]">Activity Management</h3>
      </div>

      <div className="space-y-6">
        {itineraryDetails.map((day: any, dayIndex: number) => (
          <Card key={day.dayNumber} className="border-[#2CA4BC]/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {day.dayNumber}
                  </div>
                  <div>
                    <div>
                      Day {day.dayNumber} - {day.title || "Untitled Day"}
                    </div>
                    <div className="text-sm font-normal text-gray-600">
                      {(day.activityDetails?.length || 0) + getNewActivitiesForDay(dayIndex).length} activities
                    </div>
                  </div>
                </CardTitle>
                <Button
                  onClick={() => addNewActivityCard(dayIndex)}
                  size="sm"
                  className="bg-[#2CA4BC] hover:bg-[#1a5f6b] w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Existing Activities */}
                {day.activityDetails?.map((activity: any, activityIndex: number) => {
                  const isTouched = getNestedTouched(['itinerary', dayIndex, 'activityDetails', activityIndex, 'name'])
                  const errorMessage = getNestedError(['itinerary', dayIndex, 'activityDetails', activityIndex, 'name'])

                  return (
                    <Card key={activity._id || activityIndex} className="border-gray-200 bg-gray-50">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-[#1a5f6b]">Activity {activityIndex + 1}</h4>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Saved</span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleActivityUpdate(dayIndex, activityIndex, activity)}
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
                              onClick={() =>
                                removeActivityFromDatabase(day.dayNumber, activity._id, dayIndex, activityIndex)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                            >
                              <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
                              <span className="sm:hidden">Delete</span>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Activity Name *</Label>
                            <Input
                              value={activity.name || ""}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, "name", e.target.value)}
                              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                              placeholder="e.g., Backwater Cruise"
                            />
                            {isTouched && errorMessage && (
                              <p className="text-red-500 text-sm">{errorMessage}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-[#2CA4BC]" />
                              Duration
                            </Label>
                            <Input
                              value={activity.duration || ""}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, "duration", e.target.value)}
                              placeholder="2 hours"
                              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Activity Description</Label>
                          <Textarea
                            value={activity.description || ""}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, "description", e.target.value)}
                            rows={2}
                            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                            placeholder="Enjoy a peaceful cruise through the backwaters..."
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                              value={activity.category || ""}
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
                              checked={activity.priceIncluded || false}
                              onCheckedChange={(checked) =>
                                updateActivity(dayIndex, activityIndex, "priceIncluded", checked)
                              }
                              className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
                            />
                            <Label
                              htmlFor={`activity-${dayIndex}-${activityIndex}-price`}
                              className="font-medium text-sm"
                            >
                              Price Included in Package
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* New Activity Cards */}
                {getNewActivitiesForDay(dayIndex).map(([activityKey, newActivity]) => (
                  <Card key={activityKey} className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#1a5f6b]">New Activity</h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Draft</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            onClick={() => saveNewActivityToDatabase(dayIndex, activityKey)}
                            className="bg-[#2CA4BC] hover:bg-[#1a5f6b] flex-1 sm:flex-none"
                            disabled={savingActivity === activityKey}
                          >
                            {savingActivity === activityKey ? (
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
                            onClick={() => removeNewActivityCard(activityKey)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                          >
                            <X className="h-4 w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Remove</span>
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Activity Name *</Label>
                          <Input
                            value={newActivity.name}
                            onChange={(e) => updateNewActivity(activityKey, "name", e.target.value)}
                            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                            placeholder="e.g., Backwater Cruise"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-[#2CA4BC]" />
                            Duration
                          </Label>
                          <Input
                            value={newActivity.duration}
                            onChange={(e) => updateNewActivity(activityKey, "duration", e.target.value)}
                            placeholder="2 hours"
                            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Activity Description</Label>
                        <Textarea
                          value={newActivity.description}
                          onChange={(e) => updateNewActivity(activityKey, "description", e.target.value)}
                          rows={2}
                          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                          placeholder="Enjoy a peaceful cruise through the backwaters..."
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={newActivity.category}
                            onValueChange={(value) => updateNewActivity(activityKey, "category", value)}
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
                            id={`new-activity-${activityKey}-price`}
                            checked={newActivity.priceIncluded}
                            onCheckedChange={(checked) => updateNewActivity(activityKey, "priceIncluded", checked)}
                            className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
                          />
                          <Label htmlFor={`new-activity-${activityKey}-price`} className="font-medium text-sm">
                            Price Included in Package
                          </Label>
                        </div>
                      </div>

                      <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          <strong>Note:</strong> Fill in the activity details and click "Add Activity" to save it to the
                          database.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!day.activityDetails || day.activityDetails.length === 0) &&
                  getNewActivitiesForDay(dayIndex).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No activities added for this day yet.</p>
                      <p className="text-xs mt-1">Click "Add Activity" to get started.</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {itineraryDetails.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Please configure your itinerary first to add activities.</p>
        </div>
      )}
    </div>
  )
}