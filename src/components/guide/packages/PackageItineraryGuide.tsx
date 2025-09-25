"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Star, Car, Utensils, Bed, Clock, CheckCircle, XCircle, Camera } from "lucide-react"
import type { TravelPackage } from "@/types/packageType"

interface PackageItineraryProps {
  packageData: TravelPackage
}

export function PackageItinerary({ packageData }: PackageItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1])

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => (prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]))
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: "bg-green-50 text-green-700 border-green-200",
      cultural: "bg-purple-50 text-purple-700 border-purple-200",
      sightseeing: "bg-blue-50 text-blue-700 border-blue-200",
      adventure: "bg-orange-50 text-orange-700 border-orange-200",
      food: "bg-yellow-50 text-yellow-700 border-yellow-200",
      transfer: "bg-gray-50 text-gray-700 border-gray-200",
      "water-sports": "bg-cyan-50 text-cyan-700 border-cyan-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getActivityIcon = (category: string) => {
    const icons = {
      nature: Camera,
      cultural: Star,
      sightseeing: Camera,
      adventure: Star,
      food: Utensils,
      transfer: Car,
      "water-sports": Star,
    }
    const Icon = icons[category as keyof typeof icons] || Star
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#1a5f6b] mb-2">Detailed Day-wise Itinerary</h3>
        <p className="text-gray-600">Explore every moment of your {packageData.duration.days}-day journey</p>
      </div>

      <div className="space-y-4">
        {packageData.itineraryDetails.days.map((day) => (
          <Collapsible
            key={day.dayNumber}
            open={expandedDays.includes(day.dayNumber)}
            onOpenChange={() => toggleDay(day.dayNumber)}
          >
            <Card className="border-[#2CA4BC]/30 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-[#2CA4BC]/5 hover:to-[#1a5f6b]/5 transition-all duration-300 border-b border-[#2CA4BC]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        {day.dayNumber}
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-[#1a5f6b] text-lg md:text-xl">{day.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Day {day.dayNumber} of {packageData.duration.days} • {day.activityDetails?.length || 0}{" "}
                          Activities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#2CA4BC]/10 text-[#2CA4BC] border-[#2CA4BC]/30">
                        {day.activityDetails?.length || 0} Activities
                      </Badge>
                      {expandedDays.includes(day.dayNumber) ? (
                        <ChevronUp className="h-6 w-6 text-[#2CA4BC]" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-[#2CA4BC]" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-6 pb-6 space-y-6">
                  {/* Description */}
                  <div className="bg-gradient-to-r from-[#2CA4BC]/5 to-[#1a5f6b]/5 p-4 rounded-lg border border-[#2CA4BC]/20">
                    <p className="text-gray-700 leading-relaxed">{day.description}</p>
                  </div>

                  {/* Activities */}
                  {day.activityDetails && day.activityDetails.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2 text-lg">
                        <Star className="h-5 w-5 text-[#2CA4BC]" />
                        Activities & Experiences
                      </h4>
                      <div className="grid gap-4">
                        {day.activityDetails.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-[#2CA4BC]/30 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getActivityIcon(activity.category)}
                                <h5 className="font-semibold text-[#1a5f6b] text-lg">{activity.name}</h5>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getCategoryColor(activity.category)}>
                                  {activity.category}
                                </Badge>
                                {activity.priceIncluded ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">{activity.duration}</span>
                              </div>
                              <span
                                className={`font-medium ${activity.priceIncluded ? "text-green-600" : "text-red-600"}`}
                              >
                                {activity.priceIncluded ? "✓ Included in package" : "⚠ Additional cost"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transfers, Meals & Accommodation */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transfers */}
                    {day.transfers && day.transfers.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                          <Car className="h-4 w-4 text-[#2CA4BC]" />
                          Transfers
                        </h4>
                        <div className="space-y-2">
                          {day.transfers.map((transfer, transferIndex) => (
                            <Badge
                              key={transferIndex}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 block w-full justify-start p-2"
                            >
                              <Car className="h-3 w-3 mr-2" />
                              {transfer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meals */}
                    <div>
                      <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-[#2CA4BC]" />
                        Meals
                      </h4>
                      <div className="space-y-2">
                        {day.meals.breakfast && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 block w-full justify-start p-2"
                          >
                            ☀️ Breakfast
                          </Badge>
                        )}
                        {day.meals.lunch && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 block w-full justify-start p-2"
                          >
                            🌞 Lunch
                          </Badge>
                        )}
                        {day.meals.dinner && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 block w-full justify-start p-2"
                          >
                            🌙 Dinner
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Accommodation */}
                    {day.accommodation && (
                      <div>
                        <h4 className="font-semibold text-[#1a5f6b] mb-3 flex items-center gap-2">
                          <Bed className="h-4 w-4 text-[#2CA4BC]" />
                          Accommodation
                        </h4>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium">{day.accommodation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
