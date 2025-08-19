"use client"
import PackagesListing from "@/components/client/PackagesListing/PackagesListing"
import {motion} from "framer-motion"

export default function PackagesListingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <PackagesListing/>
    </motion.div>
  )
}
