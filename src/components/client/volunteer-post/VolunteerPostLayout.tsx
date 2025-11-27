
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useClientAuth } from "@/hooks/auth/useAuth";

interface VolunteerPostLayoutProps {
  children?: React.ReactNode;
}

export function VolunteerPostLayout({ children }: VolunteerPostLayoutProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] via-white to-[#F5F1E8]/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#2CA4BC]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#1a5f6b]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2CA4BC]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Main Content Area - Full Width */}
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Floating "New Post" Button */}
      {isLoggedIn && (
        <Button
          onClick={() => navigate("/pvt/posts/create")}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white shadow-2xl hover:shadow-[#2CA4BC]/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center p-0"
          size="icon"
        >
          <Plus className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
      )}
    </div>
  );
}















