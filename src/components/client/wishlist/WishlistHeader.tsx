"use client"

import { motion } from "framer-motion"
import {Heart } from "lucide-react"

interface WishlistHeaderProps {
  totalItems: number
}

export function WishlistHeader({
  totalItems,
}: WishlistHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            {totalItems} {totalItems === 1 ? "package" : "packages"} saved for later
          </p>
        </div>
      </div>
    </motion.div>
  )
}
