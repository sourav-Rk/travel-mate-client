"use client"
import { AdminPackagesView } from "@/components/admin/package/packageViewTable/AdminPackageViewTable"
import {motion} from "framer-motion"

export default function AdminPackagesTableViewPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <AdminPackagesView/>
    </motion.div>
  )}