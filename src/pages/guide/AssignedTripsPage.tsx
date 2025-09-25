"use client"
import { AssignedTripsList } from "@/components/guide/assignedTrips/AssignedTripsList"
import {motion} from "framer-motion"

export default function AssignedTripsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <AssignedTripsList/>
    </motion.div>
  )
}