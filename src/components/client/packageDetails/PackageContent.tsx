import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar, Users, MapPin, Clock, Check, X, ChevronDown, ChevronUp, Car, Utensils, Camera } from "lucide-react"
import type { TravelPackage } from "@/types/packageType"

interface PackageContentProps {
  packageData: TravelPackage | undefined
  openDays: { [key: string]: boolean }
  toggleDay: (dayId: string | undefined) => void
  formatDate: (date: Date | undefined) => string
}

export default function PackageContent({ packageData, openDays, toggleDay, formatDate }: PackageContentProps) {
  return (
    <>
      {/* Description */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{packageData?.description}</p>
        </CardContent>
      </Card>

      {/* Package Details */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
            Package Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-[#2CA4BC]" />
              <div>
                <p className="font-semibold text-gray-900">Duration</p>
                <p className="text-gray-600">
                  {packageData?.duration.days} Days, {packageData?.duration.nights} Nights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-[#2CA4BC]" />
              <div>
                <p className="font-semibold text-gray-900">Group Size</p>
                <p className="text-gray-600">Max {packageData?.maxGroupSize} people</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-[#2CA4BC]" />
              <div>
                <p className="font-semibold text-gray-900">Start Date</p>
                <p className="text-gray-600">{formatDate(packageData?.startDate!)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-[#2CA4BC]" />
              <div>
                <p className="font-semibold text-gray-900">End Date</p>
                <p className="text-gray-600">{formatDate(packageData?.endDate!)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
              <MapPin className="w-6 h-6 text-[#2CA4BC]" />
              <div>
                <p className="font-semibold text-gray-900">Meeting Point</p>
                <p className="text-gray-600">{packageData?.meetingPoint}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary - Main Part with Accordion */}
      {packageData?.itineraryDetails && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
              Itinerary
            </h3>
            <div className="space-y-4">
              {packageData.itineraryDetails.days.map((day, index) => (
                <Collapsible
                  key={day._id || index}
                  open={openDays[day?._id || ""]}
                  onOpenChange={() => toggleDay(day?._id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2CA4BC]/10 to-[#2CA4BC]/5 rounded-lg border border-[#2CA4BC]/20 hover:border-[#2CA4BC]/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center font-bold">
                          {day.dayNumber}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg text-gray-900">
                            Day {day.dayNumber}: {day.title}
                          </h4>
                          <p className="text-gray-600 text-sm">Click to view details</p>
                        </div>
                      </div>
                      {openDays[day?._id || ""] ? (
                        <ChevronUp className="w-5 h-5 text-[#2CA4BC]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#2CA4BC]" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg ml-6 space-y-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-lg">Overview</h5>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{day.description}</p>
                      </div>

                      {day.accommodation && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#2CA4BC] rounded-full"></div>
                            Accommodation
                          </h5>
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-gray-700">{day.accommodation}</p>
                          </div>
                        </div>
                      )}

                      {day.activityDetails && day.activityDetails.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-[#2CA4BC]" />
                            Activities
                          </h5>
                          <div className="space-y-3">
                            {day.activityDetails.map((activity) => (
                              <div
                                key={activity._id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h6 className="font-semibold text-gray-900 text-lg">{activity.name}</h6>
                                  {activity.priceIncluded !== undefined && (
                                    <Badge
                                      variant={activity.priceIncluded ? "default" : "secondary"}
                                      className={activity.priceIncluded ? "bg-green-600" : "bg-gray-500"}
                                    >
                                      {activity.priceIncluded ? "Included" : "Extra Cost"}
                                    </Badge>
                                  )}
                                </div>

                                {activity.description && (
                                  <p className="text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm">
                                  {activity.duration && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <Clock className="w-4 h-4 text-[#2CA4BC]" />
                                      <span>{activity.duration}</span>
                                    </div>
                                  )}
                                  {activity.category && (
                                    <div className="flex items-center gap-1">
                                      <Badge variant="outline" className="border-[#2CA4BC] text-[#2CA4BC]">
                                        {activity.category}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Car className="w-5 h-5 text-[#2CA4BC]" />
                          Transfers
                        </h5>
                        {day.transfers && day.transfers.length > 0 ? (
                          <div className="space-y-2">
                            {day.transfers.map((transfer, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div className="w-2 h-2 bg-[#2CA4BC] rounded-full"></div>
                                <span className="text-gray-700">{transfer}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">All transfers included as per itinerary</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-[#2CA4BC]" />
                          Meals
                        </h5>
                        {day.meals && Array.isArray(day.meals) && day.meals.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {day?.meals?.map((meal, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-gray-700 text-sm">{meal}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">Breakfast, Lunch & Dinner included</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inclusions & Exclusions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Inclusions
            </h3>
            <ul className="space-y-3">
              {packageData?.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              Exclusions
            </h3>
            <ul className="space-y-3">
              {packageData?.exclusions.map((exclusion, index) => (
                <li key={index} className="flex items-start gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{exclusion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Terms & Conditions */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-[#2CA4BC] rounded"></div>
            Terms & Conditions
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{packageData?.termsAndConditions}</p>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded"></div>
            Cancellation Policy
          </h3>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-gray-700 leading-relaxed">{packageData?.cancellationPolicy}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
