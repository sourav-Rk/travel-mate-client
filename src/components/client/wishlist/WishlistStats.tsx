"use client"

import { motion } from "framer-motion"
import { Heart, Clock } from "lucide-react"
import type { PackageDetailsWishlistDto } from "@/types/wishlistType"

interface WishlistStatsProps {
  packages: PackageDetailsWishlistDto[]
}

export function WishlistStats({ packages }: WishlistStatsProps) {
  const totalPackages = packages.length
  const upcomingDeadlines = packages.filter((pkg) => new Date(pkg.applicationDeadline) > new Date()).length

  const stats = [
    {
      title: "Total Packages",
      value: totalPackages.toString(),
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      delay: 0.1,
    },
    {
      title: "Active Deadlines",
      value: upcomingDeadlines.toString(),
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      delay: 0.4,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay, duration: 0.4 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 truncate">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
