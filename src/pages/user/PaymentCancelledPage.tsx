"use client"
import PaymentCancelled from "@/components/client/PaymentCancelled"
import {motion} from "framer-motion"

export default function PaymentCancelledPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <PaymentCancelled/>
    </motion.div>
  )
}
