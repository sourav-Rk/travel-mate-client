"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PackageDetailsHeaderProps {
  packageId: string
  status: string
}

export function PackageDetailsHeader({ packageId, status }: PackageDetailsHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
      <Button
        onClick={() => navigate("/vendor/packages")}
        variant="ghost"
        size="sm"
        className="hover:bg-white/80 border border-slate-300 transition-all duration-200 hover:shadow-md"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Package Management
      </Button>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-slate-600">
        <span className="font-medium">
          Package ID: <span className="font-mono text-[#1a5f6b]">{packageId}</span>
        </span>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 shadow-sm">
          {status}
        </Badge>
      </div>
    </div>
  )
}
