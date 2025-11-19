"use client"

import { Card, CardContent } from "@/components/ui/card"
import type{ LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  change?: string
  trend?: "up" | "down"
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  change,
  trend,
}: StatCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return `${val.toLocaleString()}`
    }
    return val
  }

  return (
    <Card className="border border-[#2d3748] shadow-sm bg-gradient-to-br from-[#1e293b] to-[#0f172a] hover:shadow-xl hover:scale-105 hover:border-[#3d4758] transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{title}</p>
            <p className="text-2xl font-bold text-white mt-2">
              {formatValue(value)}  
            </p>
            {change && trend && (
              <div className="flex items-center mt-2">
                {trend === "up" ? (
                  <span className="text-green-500 text-sm font-medium">
                    {change}
                  </span>
                ) : (
                  <span className="text-red-500 text-sm font-medium">
                    {change}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}















