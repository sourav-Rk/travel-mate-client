import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VolunteeringSidebar } from "./VolunteeringSidebar";

interface VolunteeringMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VolunteeringMobileMenu({
  isOpen,
  onClose,
}: VolunteeringMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 lg:hidden"
          >
            <div className="h-full">
              <VolunteeringSidebar isMobile={true} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}









