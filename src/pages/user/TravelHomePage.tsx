"use client"

import TravelHome from "@/components/client/HomePage/TravelHome"
import {motion} from "framer-motion"

export default function TravelHomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <TravelHome/>
    </motion.div>
  )
}
