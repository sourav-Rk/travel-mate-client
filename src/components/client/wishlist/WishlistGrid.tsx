"use client"

import { motion } from "framer-motion"
import { WishlistCard } from "./WshlistCard"
import type { PackageDetailsWishlistDto } from "@/types/wishlistType"

interface WishlistGridProps {
  packages: PackageDetailsWishlistDto[]
}

export function WishlistGrid({ packages }: WishlistGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {packages.map((pkg, index) => (
        <WishlistCard key={pkg._id} package={pkg} index={index} />
      ))}
    </motion.div>
  )
}
