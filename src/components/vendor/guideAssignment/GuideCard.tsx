"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, PhoneCall, Users, Clock, Languages, MapPin, UserCheck,Mail } from "lucide-react"
import type { GuideListDto } from "@/types/api/guide"

interface GuideCardProps {
  guide: GuideListDto
  onAssign: (guideId: string) => void
  isAssigning?: boolean
}

export function GuideCard({ guide, onAssign, isAssigning = false }: GuideCardProps) {
  const isAvailable = guide.isAvailable === true
  
  const getAvailabilityColor = (availability: boolean) => {
    return availability === true
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200"
  }

  const getStatusBadge = (availability: boolean) => {
    if (availability === true) {
      return {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <UserCheck className="h-3 w-3" />,
        text: "Free"
      }
    } else {
      return {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: <MapPin className="h-3 w-3" />,
        text: "In Trip"
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const statusBadge = getStatusBadge(isAvailable)

  return (
    <Card 
      className={`
        border border-gray-100 shadow-sm transition-all duration-200 rounded-xl overflow-hidden
        ${isAvailable 
          ? "bg-white hover:shadow-md cursor-pointer" 
          : "bg-red-50/30 border-red-200/50 cursor-not-allowed opacity-75"
        }
      `}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar 
                className={`
                  h-14 w-14 border-2 
                  ${isAvailable ? "border-gray-100" : "border-red-200 opacity-75"}
                `}
              >
                <AvatarImage 
                  src={guide.profileImage || "/placeholder.svg"} 
                  alt={guide.firstName} 
                  className={`object-cover ${!isAvailable ? "grayscale opacity-75" : ""}`} 
                />
                <AvatarFallback 
                  className={`
                    font-semibold text-base
                    ${isAvailable 
                      ? "bg-gray-100 text-gray-700" 
                      : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {getInitials(guide.firstName)}
                </AvatarFallback>
              </Avatar>
              {/* Status indicator dot */}
              <div 
                className={`
                  absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${isAvailable ? "bg-emerald-500" : "bg-orange-500"}
                `}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 
                    className={`
                      font-semibold text-lg
                      ${isAvailable ? "text-gray-900" : "text-red-700"}
                    `}
                  >
                    {guide.firstName}
                  </h3>
                  <p className={`text-sm ${isAvailable ? "text-gray-500" : "text-red-500"}`}>
                    ID: {guide._id}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge
                    className={`${getAvailabilityColor(guide.isAvailable)} px-3 py-1 text-sm font-medium rounded-full border w-fit`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${guide.isAvailable === true ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                      {guide.isAvailable === true ? "Available" : "Unavailable"}
                    </div>
                  </Badge>
                  <Badge
                    className={`${statusBadge.color} px-3 py-1 text-xs font-medium rounded-full border w-fit`}
                  >
                    <div className="flex items-center gap-1.5">
                      {statusBadge.icon}
                      {statusBadge.text}
                    </div>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 
              className={`
                text-sm font-semibold uppercase tracking-wide
                ${isAvailable ? "text-gray-700" : "text-red-600"}
              `}
            >
              Contact Information
            </h4>
            <div 
              className={`
                border rounded-lg p-3 space-y-2
                ${isAvailable 
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
                  : "bg-red-50/50 border-red-200"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Phone className={`h-4 w-4 ${isAvailable ? "text-blue-600" : "text-red-500"}`} />
                <div>
                  <p 
                    className={`
                      text-xs font-medium
                      ${isAvailable ? "text-blue-600" : "text-red-500"}
                    `}
                  >
                    Primary Phone
                  </p>
                  <p 
                    className={`
                      text-sm font-semibold
                      ${isAvailable ? "text-gray-900" : "text-red-700"}
                    `}
                  >
                    {guide.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className={`h-4 w-4 ${isAvailable ? "text-blue-600" : "text-red-500"}`} />
                <div>
                  <p 
                    className={`
                      text-xs font-medium
                      ${isAvailable ? "text-blue-600" : "text-red-500"}
                    `}
                  >
                    Email
                  </p>
                  <p 
                    className={`
                      text-sm font-semibold
                      ${isAvailable ? "text-gray-900" : "text-red-700"}
                    `}
                  >
                    {guide.email}
                  </p>
                </div>
              </div>

              {guide.alternatePhone && (
                <div className="flex items-center gap-3">
                  <PhoneCall className={`h-4 w-4 ${isAvailable ? "text-blue-600" : "text-red-500"}`} />
                  <div>
                    <p 
                      className={`
                        text-xs font-medium
                        ${isAvailable ? "text-blue-600" : "text-red-500"}
                      `}
                    >
                      Alternate Phone
                    </p>
                    <p 
                      className={`
                        text-sm font-semibold
                        ${isAvailable ? "text-gray-900" : "text-red-700"}
                      `}
                    >
                      {guide.alternatePhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 
              className={`
                text-sm font-semibold uppercase tracking-wide
                ${isAvailable ? "text-gray-700" : "text-red-600"}
              `}
            >
              Guide Details
            </h4>
            <div 
              className={`
                border rounded-lg p-3 space-y-2
                ${isAvailable 
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
                  : "bg-red-50/50 border-red-200"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Users className={`h-4 w-4 ${isAvailable ? "text-green-600" : "text-red-500"}`} />
                <div>
                  <p 
                    className={`
                      text-xs font-medium
                      ${isAvailable ? "text-green-600" : "text-red-500"}
                    `}
                  >
                    Gender
                  </p>
                  <p 
                    className={`
                      text-sm font-semibold
                      ${isAvailable ? "text-gray-900" : "text-red-700"}
                    `}
                  >
                    {guide.gender}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className={`h-4 w-4 ${isAvailable ? "text-green-600" : "text-red-500"}`} />
                <div>
                  <p 
                    className={`
                      text-xs font-medium
                      ${isAvailable ? "text-green-600" : "text-red-500"}
                    `}
                  >
                    Experience
                  </p>
                  <p 
                    className={`
                      text-sm font-semibold
                      ${isAvailable ? "text-gray-900" : "text-red-700"}
                    `}
                  >
                    {guide.yearOfExperience} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 
              className={`
                text-sm font-semibold uppercase tracking-wide flex items-center gap-2
                ${isAvailable ? "text-gray-700" : "text-red-600"}
              `}
            >
              <Languages className="h-4 w-4" />
              Languages
            </h4>
            <div 
              className={`
                border rounded-lg p-3
                ${isAvailable 
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200" 
                  : "bg-red-50/50 border-red-200"
                }
              `}
            >
              <div className="flex flex-wrap gap-2">
                {guide.languageSpoken.map((language, index) => (
                  <Badge
                    key={index}
                    className={`
                      border text-xs font-medium shadow-sm px-2 py-1 rounded-md transition-colors
                      ${isAvailable 
                        ? "bg-white text-purple-700 border-purple-300 hover:bg-purple-100" 
                        : "bg-red-100 text-red-600 border-red-300"
                      }
                    `}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Button
              onClick={() => onAssign(guide._id)}
              disabled={!isAvailable || isAssigning}
              className={`
                w-full sm:w-auto font-medium px-6 py-2.5 rounded-lg transition-colors
                ${isAvailable && !isAssigning
                  ? "bg-gray-900 hover:bg-gray-800 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {isAssigning ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Assigning...
                </div>
              ) : !isAvailable ? (
                "Guide Unavailable"
              ) : (
                "Assign Trip"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}