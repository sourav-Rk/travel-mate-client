import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { motion } from "framer-motion";
export function UserPasswordChangePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <ChangePasswordForm role="client" />
    </motion.div>
  );
}
