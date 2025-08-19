"use client"
import { useFormikContext } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  className?: string
}

export function ReviewForm({ className }: ReviewFormProps) {
  const { values } = useFormikContext<any>()

  return (
    <div className={cn("space-y-8", className)}>
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
                <strong>Package Name:</strong> {values.basicDetails?.packageName || "Not specified"}
              </div>
              <div>
                <strong>Title:</strong> {values.basicDetails?.title || "Not specified"}
              </div>
              <div>
                <strong>Category:</strong> {values.basicDetails?.category || "Not specified"}
              </div>
              <div>
                <strong>Duration:</strong> {values.basicDetails?.duration?.days || 0} Days /{" "}
                {values.basicDetails?.duration?.nights || 0} Nights
              </div>
              <div>
                <strong>Max Group Size:</strong> {values.basicDetails?.maxGroupSize || 0} people
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <strong>Price:</strong> ₹{(values.basicDetails?.price || 0).toLocaleString()}
              </div>
              <div>
                <strong>Meeting Point:</strong> {values.basicDetails?.meetingPoint || "Not specified"}
              </div>
              <div>
                <strong>Images:</strong> {(values.basicDetails?.images || []).length} uploaded
              </div>
              <div>
                <strong>Inclusions:</strong> {(values.basicDetails?.inclusions || []).length} items
              </div>
              <div>
                <strong>Exclusions:</strong> {(values.basicDetails?.exclusions || []).length} items
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {values.basicDetails?.tags && values.basicDetails.tags.length > 0 && (
        <Card className="border-[#2CA4BC]/20">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b]">Tags</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {values.basicDetails.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-[#2CA4BC]/10 text-[#1a5f6b]">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">What's Included</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {(values.basicDetails?.inclusions || []).map((inclusion: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">{inclusion}</span>
                </div>
              ))}
              {(!values.basicDetails?.inclusions || values.basicDetails.inclusions.length === 0) && (
                <p className="text-gray-500 italic">No inclusions specified</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">What's Not Included</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {(values.basicDetails?.exclusions || []).map((exclusion: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-800">{exclusion}</span>
                </div>
              ))}
              {(!values.basicDetails?.exclusions || values.basicDetails.exclusions.length === 0) && (
                <p className="text-gray-500 italic">No exclusions specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Itinerary Summary */}
      <Card className="border-[#2CA4BC]/20">
        <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
          <CardTitle className="text-[#1a5f6b]">Itinerary Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {(values.itinerary || []).map((day: any, index: number) => (
              <div key={index} className="border-l-4 border-[#2CA4BC] pl-4">
                <h4 className="font-semibold text-[#1a5f6b]">
                  Day {day.dayNumber}: {day.title || "Untitled Day"}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{day.description || "No description provided"}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">🏨 {day.accommodation || "No accommodation"}</Badge>
                  <Badge variant="outline">🚗 {(day.transfers || []).length} transfers</Badge>
                  <Badge variant="outline">🍽️ {Object.values(day.meals || {}).filter(Boolean).length} meals</Badge>
                  <Badge variant="outline">🎯 {(day.activities || []).length} activities</Badge>
                </div>
              </div>
            ))}
            {(!values.itinerary || values.itinerary.length === 0) && (
              <p className="text-gray-500 italic">No itinerary days specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#2CA4BC]/20">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b]">Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-700">
              {values.basicDetails?.cancellationPolicy || "No cancellation policy specified"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#2CA4BC]/20">
          <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
            <CardTitle className="text-[#1a5f6b]">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-700">
              {values.basicDetails?.termsAndConditions || "No terms and conditions specified"}
            </p>
          </CardContent>
        </Card>
      </div>

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
}
