import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useMyPosts } from "@/hooks/volunteer-post/useVolunteerPost";

export function VolunteerPostProfileCard() {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();
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
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 border-4 border-[#F5F1E8] mb-3">
            <AvatarImage
              src={profile.profileImage || profile.userDetails?.profileImage}
              alt={`${profile.userDetails?.firstName || ""} ${profile.userDetails?.lastName || ""}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white text-2xl font-semibold">
              {profile.userDetails?.firstName?.[0] || "G"}
              {profile.userDetails?.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {profile.userDetails?.firstName && profile.userDetails?.lastName
              ? `${profile.userDetails.firstName} ${profile.userDetails.lastName}`
              : profile.userDetails?.firstName || profile.userDetails?.lastName || "Local Guide"}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1a5f6b]">{totalPosts}</p>
            <p className="text-xs text-slate-600">Total Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#2CA4BC]">{publishedPosts}</p>
            <p className="text-xs text-slate-600">Published</p>
          </div>
        </div>

        {/* Location */}
        {profile.location && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-200">
            <MapPin className="w-4 h-4 text-[#2CA4BC]" />
            <span className="truncate">
              {profile.location.city}, {profile.location.state}
            </span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="space-y-2 mb-4">
          {profile.hourlyRate > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Hourly Rate</span>
              <span className="font-semibold text-[#1a5f6b]">₹{profile.hourlyRate}</span>
            </div>
          )}
          {profile.languages && profile.languages.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Languages</span>
              <span className="font-semibold text-[#1a5f6b]">{profile.languages.length}</span>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        <Button
          onClick={() => navigate("/pvt/local-guide/profile")}
          className="w-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90"
        >
          <User className="w-4 h-4 mr-2" />
          View Full Profile
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );
}


