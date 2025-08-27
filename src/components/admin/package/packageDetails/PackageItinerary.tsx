"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, MapPin, Utensils, Bed, Car, Clock, Tag } from "lucide-react";
import type {Day} from "@/types/packageType"

interface PackageItineraryProps {
  itineraryDetails: Day[]
}

export function PackageItinerary({ itineraryDetails }: PackageItineraryProps) {
  const [openDays, setOpenDays] = useState<number[]>([])

  const toggleDay = (dayNumber: number) => {
    setOpenDays((prev) => (prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]))
  }

  return (
    <Card className="border-black shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-25 to-gray-50 border-b border-black">
        <CardTitle className="text-gray-900 flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-blue-600" />
          Detailed Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {itineraryDetails.map((day) => (
            <Collapsible
              key={day.dayNumber}
              open={openDays.includes(day.dayNumber)}
              onOpenChange={() => toggleDay(day.dayNumber)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-black hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                      {day.dayNumber}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{day.title}</h3>
                      <p className="text-sm text-gray-600 truncate max-w-md">{day.description}</p>
                    </div>
                  </div>
                  {openDays.includes(day.dayNumber) ? (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2">
                <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-4">
                  {/* Description */}
                  <div className="p-4 rounded-lg bg-gray-50 border border-black">
                    <p className="text-gray-700">{day.description}</p>
                  </div>

                  {/* Accommodation */}
                  {day.accommodation && (
                    <div className="p-4 rounded-lg bg-gray-50 border border-black">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Bed className="h-4 w-4 text-blue-600" />
                        Accommodation
                      </h4>
                      <p className="text-gray-700">{day.accommodation}</p>
                    </div>
                  )}

                  {/* Transfers */}
                  {day.transfers && day.transfers.length > 0 && (
                    <div className="p-4 rounded-lg bg-gray-50 border border-black">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        Transfers
                      </h4>
                      <ul className="space-y-1">
                        {day.transfers.map((transfer, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            {transfer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Meals */}
               {day.meals && (
                  <div className="p-4 rounded-lg bg-gray-50 border border-black">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-blue-600" />
                      Meals
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {day.meals.breakfast && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm border border-blue-200">
                          Breakfast
                        </span>
                      )}
                      {day.meals.lunch && (
                       
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm border border-green-200">
                          Lunch
                        </span>
                      )}
                      {day.meals.dinner && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm border border-yellow-200">
                          Dinner
                        </span>
                      )}
                    </div>
                  </div>
                )}


                  {/* Activities */}
                  {day.activityDetails && day.activityDetails.length > 0 && (
                    <div className="p-4 rounded-lg bg-gray-50 border border-black">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Activities
                      </h4>
                      <div className="space-y-3">
                        {day.activityDetails.map((activity, index) => (
                          <div key={index} className="p-3 rounded-lg bg-white border border-black shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{activity.name}</h5>
                              <div className="flex items-center gap-2">
                                {activity.priceIncluded ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">
                                    Included
                                  </span>
                                ) : (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200">
                                    Extra Cost
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {activity.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
