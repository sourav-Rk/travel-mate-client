import { GuideDetails } from "@/components/vendor/GuideDetails";
import { motion } from "framer-motion";
export default function GuideDetailsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <GuideDetails />
    </motion.div>
  );
}
