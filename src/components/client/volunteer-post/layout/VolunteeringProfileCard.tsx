import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Heart,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { LocalGuideProfile } from "@/types/local-guide";

interface VolunteeringProfileCardProps {
  profile: LocalGuideProfile;
  totalViews?: number;
  totalLikes?: number;
}

export function VolunteeringProfileCard({
  profile,
  totalViews = 0,
  totalLikes = 0,
}: VolunteeringProfileCardProps) {
  const navigate = useNavigate();

  const firstName = profile.userDetails?.firstName || "Guide";
  const lastName = profile.userDetails?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Local Guide";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "LG";

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
    <Card className="border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center text-center mb-3">
          <Avatar className="h-14 w-14 lg:h-16 lg:w-16 border-2 border-[#2CA4BC]/30 mb-2 shadow-sm">
            <AvatarImage
              src={profile.profileImage || profile.userDetails?.profileImage}
              alt={fullName}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white font-semibold text-sm lg:text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1.5 line-clamp-1 w-full px-2">
            {fullName}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-slate-200/50">
          <div className="text-center bg-gradient-to-br from-[#2CA4BC]/5 to-[#2CA4BC]/10 rounded-lg py-2 px-1">
            <p className="text-xl lg:text-2xl font-bold text-[#1a5f6b]">
              {profile.stats?.totalPosts || 0}
            </p>
            <p className="text-xs text-slate-600">Posts</p>
          </div>
          <div className="text-center bg-gradient-to-br from-[#2CA4BC]/5 to-[#2CA4BC]/10 rounded-lg py-2 px-1">
            <p className="text-xl lg:text-2xl font-bold text-[#2CA4BC]">{totalViews}</p>
            <p className="text-xs text-slate-600">Views</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-200/50">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50/50 rounded-md py-1.5 px-2">
            <Heart className="w-3 h-3 text-[#2CA4BC] flex-shrink-0" />
            <span className="truncate">{totalLikes} Likes</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50/50 rounded-md py-1.5 px-2">
            <Eye className="w-3 h-3 text-[#2CA4BC] flex-shrink-0" />
            <span className="truncate">{profile.stats?.totalSessions || 0} Sessions</span>
          </div>
        </div>

        {/* View Profile Button */}
        <Button
          onClick={() => navigate("/pvt/local-guide/profile")}
          variant="outline"
          className="w-full border-[#2CA4BC]/30 text-[#2CA4BC] hover:bg-[#2CA4BC]/10 hover:border-[#2CA4BC]/50 text-xs lg:text-sm h-8 lg:h-9 transition-all duration-200"
        >
          <ExternalLink className="w-3 h-3 mr-1.5" />
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}






