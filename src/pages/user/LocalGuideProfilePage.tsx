import { GuideProfileLayout } from "@/components/client/local-guide/GuideProfileLayout";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function LocalGuideProfilePage() {
  const { isLoggedIn } = useClientAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useLocalGuideProfileQuery(isLoggedIn);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Local Guide Profile</h2>
          <p className="text-slate-600 mb-6">
            You need to become a local guide first to access your profile.
          </p>
          <Button
            onClick={() => navigate("/pvt/local-guide/verification")}
            className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Become a Local Guide
          </Button>
        </div>
      </div>
    );
  }

  return <GuideProfileLayout profile={profile} />;
}


