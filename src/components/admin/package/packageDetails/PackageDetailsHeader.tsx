"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PackageDetailsHeaderProps {
  packageName: string
  title: string
  category: string
  status: string
  duration: { days: number; nights: number }
  maxGroupSize: number
  price: number,
  agencyId : string
}

export function PackageDetailsHeader({
  packageName,
  title,
  category,
  status,
  duration,
  maxGroupSize,
  price,
  agencyId
}: PackageDetailsHeaderProps) {

  const navigate = useNavigate();
  
  const handleViewAgency = () => {
    navigate(`/admin/ad_pvt/vendor/${agencyId}`)
  }
  return (
    <div className="bg-white border-b border-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                {category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  status === "active"
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }
              >
                {status}
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-black">{packageName}</h1>
            <p className="text-gray-600 text-lg">{title}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:text-right">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>
                  {duration.days}D/{duration.nights}N
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Max {maxGroupSize}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">₹{price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">per person</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-black text-black hover:bg-black hover:text-white bg-transparent"
                onClick={handleViewAgency}
              >
                <Building2 className="h-4 w-4 mr-2" />
                View Agency
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
