"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Edit2 } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useUpdateLocalGuideAvailability } from "@/hooks/local-guide/useLocalGuideVerification"
import type { LocalGuideProfile } from "@/types/local-guide"

interface AvailabilitySectionProps {
  profile: LocalGuideProfile
  onUpdate?: () => void
}

export function AvailabilitySection({ profile, onUpdate }: AvailabilitySectionProps) {
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable)
  const [availabilityNote, setAvailabilityNote] = useState(
    profile.availabilityNote || ""
  )
  const [isEditing, setIsEditing] = useState(false)
  const { mutateAsync: updateAvailability, isPending: isSaving } =
    useUpdateLocalGuideAvailability()

  // Update local state when profile changes
  useEffect(() => {
    setIsAvailable(profile.isAvailable)
    setAvailabilityNote(profile.availabilityNote || "")
  }, [profile.isAvailable, profile.availabilityNote])

  const handleSave = async () => {
    try {
     const response =  await updateAvailability({
        isAvailable,
        availabilityNote: availabilityNote.trim() || undefined,
      })
      toast.success(response.message!)
      setIsEditing(false)
      onUpdate?.()
    } catch (error: unknown) {
        const axiosError = error as {
            response?: {
              data?: {
                message?: string
              }
            }
            message?: string
          }
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to update availability"
      toast.error(errorMessage)
      console.error(error)
    }
  }

  const handleToggleAvailability = async (checked: boolean) => {
    setIsAvailable(checked)
    // Auto-save when toggling availability
    try {
      await updateAvailability({
        isAvailable: checked,
        availabilityNote: availabilityNote.trim() || undefined,
      })
      toast.success(
        checked
          ? "You are now available for bookings"
          : "You are now unavailable for bookings"
      )
      onUpdate?.()
    } catch (error: unknown) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string
            }
          }
          message?: string
        }
      // Revert the toggle on error
      setIsAvailable(!checked)
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to update availability"
      toast.error(errorMessage)
      console.error(error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="h-5 w-5 text-[#2CA4BC]" />
            Availability Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Availability Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-white/60 rounded-lg border border-slate-200/50 backdrop-blur-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm sm:text-base">
                  Available for Bookings
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {isAvailable
                    ? "You are currently available to accept bookings"
                    : "You are currently not accepting new bookings"}
                </p>
              </div>
            </div>
            <div className="flex justify-end sm:justify-start">
              <Switch
                checked={isAvailable}
                onCheckedChange={handleToggleAvailability}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Availability Note */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label htmlFor="availabilityNote" className="text-sm sm:text-base font-medium">
                Availability Note
              </Label>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-fit self-end sm:self-auto"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  id="availabilityNote"
                  value={availabilityNote}
                  onChange={(e) => setAvailabilityNote(e.target.value)}
                  placeholder="Add a note about your availability (e.g., 'Available weekends only', 'Not available in December')"
                  rows={4}
                  className="resize-none bg-white/60 backdrop-blur-sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white w-full sm:w-auto"
                    size="sm"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setAvailabilityNote(profile.availabilityNote || "")
                      setIsAvailable(profile.isAvailable)
                    }}
                    disabled={isSaving}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-4 bg-white/60 rounded-lg border border-slate-200/50 backdrop-blur-sm">
                {availabilityNote ? (
                  <p className="text-slate-700 text-sm sm:text-base whitespace-pre-wrap break-words">
                    {availabilityNote}
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm sm:text-base italic">
                    No availability note set
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-4 border-t border-slate-200/50">
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className={
                isAvailable
                  ? "bg-green-100 text-green-800 border-green-200 w-fit"
                  : "bg-gray-100 text-gray-800 border-gray-200 w-fit"
              }
            >
              {isAvailable ? "Available" : "Not Available"}
            </Badge>
            <p className="text-xs sm:text-sm text-slate-600">
              Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-5 w-5 text-[#2CA4BC]" />
            Booking Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {profile.stats.totalSessions}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Total Sessions</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {profile.stats.completedSessions}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Completed</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/60 rounded-lg backdrop-blur-sm col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {profile.stats.totalSessions > 0
                  ? Math.round(
                      (profile.stats.completedSessions / profile.stats.totalSessions) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}