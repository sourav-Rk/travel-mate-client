"use client"

import { PackageDetailsGuide } from "@/components/guide/packages/PackageViewGuide"
import {motion} from "framer-motion"

export default function GuidePackageDetailsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <PackageDetailsGuide/>
    </motion.div>
  )
}