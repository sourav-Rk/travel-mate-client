import PackageDetails from "@/components/client/packageDetails/PackageDetails";
import { motion } from "framer-motion";
export default function PackageDetailsPage() {
  return(
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white"
  >
    <PackageDetails />
  </motion.div>
  )
}
