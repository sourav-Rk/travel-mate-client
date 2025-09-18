"use client"
import { Checkout } from "@/components/client/packageDetails/Checkout"
import {motion} from "framer-motion"

export default function CheckoutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Checkout/>
    </motion.div>
  )
}
