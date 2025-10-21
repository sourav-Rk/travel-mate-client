import CancellationbookingView from "@/components/vendor/CancellationRequestView";
import { motion } from "framer-motion";
export default function CancellationBookingViewPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <CancellationbookingView />
    </motion.div>
  );
}
