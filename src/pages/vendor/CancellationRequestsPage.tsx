


import { CancellationRequestsTable } from "@/components/vendor/CancellationRequestsTable";
import { GuideDetails } from "@/components/vendor/GuideDetails";
import { motion } from "framer-motion";
export default function CancellationRequestsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <CancellationRequestsTable />
    </motion.div>
  );
}
