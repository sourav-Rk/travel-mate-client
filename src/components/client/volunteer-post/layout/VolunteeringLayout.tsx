import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VolunteeringSidebar } from "./VolunteeringSidebar";
import { VolunteeringMobileMenu } from "./VolunteeringMobileMenu";

export function VolunteeringLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">Volunteering</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <VolunteeringMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 z-20">
          <div className="h-full">
            <VolunteeringSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

