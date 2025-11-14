import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, User, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useMyPosts } from "@/hooks/volunteer-post/useVolunteerPost";

export function VolunteerPostMobileProfile() {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useLocalGuideProfileQuery(isLoggedIn);
  const { data: postsData } = useMyPosts(
    profile?._id || "",
    { page: 1, limit: 1 },
    !!profile?._id && isLoggedIn
  );

  if (!isLoggedIn || !profile) {
    return null;
  }

  const totalPosts = postsData?.total || 0;
  const publishedPosts = postsData?.posts?.filter((p) => p.status === "published").length || 0;

  const getStatusBadge = () => {
    switch (profile.verificationStatus) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-slate-200 shadow-sm bg-white">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-12 w-12 border-2 border-[#F5F1E8]">
                <AvatarImage
                  src={profile.profileImage || profile.userDetails?.profileImage}
                  alt={`${profile.userDetails?.firstName || ""} ${profile.userDetails?.lastName || ""}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white text-lg font-semibold">
                  {profile.userDetails?.firstName?.[0] || "G"}
                  {profile.userDetails?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {profile.userDetails?.firstName && profile.userDetails?.lastName
                      ? `${profile.userDetails.firstName} ${profile.userDetails.lastName}`
                      : profile.userDetails?.firstName || profile.userDetails?.lastName || "Local Guide"}
                  </h3>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>{totalPosts} Posts</span>
                  <span>{publishedPosts} Published</span>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">
            <div className="space-y-3">
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-[#2CA4BC]" />
                  <span>
                    {profile.location.city}, {profile.location.state}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                {profile.hourlyRate > 0 && (
                  <>
                    <span className="text-slate-600">Hourly Rate</span>
                    <span className="font-semibold text-[#1a5f6b]">₹{profile.hourlyRate}</span>
                  </>
                )}
              </div>
              <Button
                onClick={() => navigate("/pvt/local-guide/profile")}
                className="w-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-sm"
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

