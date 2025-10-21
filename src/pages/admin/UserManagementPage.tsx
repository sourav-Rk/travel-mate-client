import UserManagement from "@/components/admin/UserManagement";
import { motion } from "framer-motion";

export default function UserManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <UserManagement />
    </motion.div>
  );
}
