"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, MapPin, Utensils, Bed, Car, Clock, Tag } from "lucide-react"

interface IActivity {
  name: string
  description: string
  duration: string
  category: string
  priceIncluded: boolean
}

interface IDay {
  dayNumber: number
  title: string
  description: string
  accommodation: string
  transfers: string[]
  meals: string[]
  activities: IActivity[]
}

interface PackageItineraryProps {
  itineraryDetails: IDay[]
}

export function PackageItinerary({ itineraryDetails }: PackageItineraryProps) {
  const [openDays, setOpenDays] = useState<number[]>([])

  const toggleDay = (dayNumber: number) => {
    setOpenDays((prev) => (prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]))
  }

  return (
    <Card className="border-slate-700 shadow-2xl bg-slate-900 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 via-purple-400/5 to-slate-800/50 border-b border-slate-700">
        <CardTitle className="text-slate-200 flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-purple-400" />
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
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-400 text-slate-900 flex items-center justify-center font-semibold text-sm">
                      {day.dayNumber}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-200">{day.title}</h3>
                      <p className="text-sm text-slate-400 truncate max-w-md">{day.description}</p>
                    </div>
                  </div>
                  {openDays.includes(day.dayNumber) ? (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2">
                <div className="ml-4 pl-4 border-l-2 border-purple-400/30 space-y-4">
                  {/* Description */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-400">{day.description}</p>
                  </div>

                  {/* Accommodation */}
                  {day.accommodation && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <Bed className="h-4 w-4 text-purple-400" />
                        Accommodation
                      </h4>
                      <p className="text-slate-400">{day.accommodation}</p>
                    </div>
                  )}

                  {/* Transfers */}
                  {day.transfers && day.transfers.length > 0 && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <Car className="h-4 w-4 text-purple-400" />
                        Transfers
                      </h4>
                      <ul className="space-y-1">
                        {day.transfers.map((transfer, index) => (
                          <li key={index} className="text-slate-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            {transfer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Meals */}
                  {day.meals && day.meals.length > 0 && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-purple-400" />
                        Meals
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {day.meals.map((meal, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-400/20 text-purple-300 rounded text-sm border border-purple-400/30"
                          >
                            {meal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        Activities
                      </h4>
                      <div className="space-y-3">
                        {day.activities.map((activity, index) => (
                          <div key={index} className="p-3 rounded-lg bg-slate-700 border border-slate-600">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-slate-200">{activity.name}</h5>
                              <div className="flex items-center gap-2">
                                {activity.priceIncluded ? (
                                  <span className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded border border-green-400/30">
                                    Included
                                  </span>
                                ) : (
                                  <span className="text-xs bg-red-400/20 text-red-300 px-2 py-1 rounded border border-red-400/30">
                                    Extra Cost
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{activity.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
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
