"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  X,
  MapPin,
  Star,
  DollarSign,
  Edit3,
} from "lucide-react";
import type { LocalGuideProfile } from "@/types/local-guide";
import { BadgeDisplay } from "@/components/local-guide-badges/BadgeDisplay";
import { useGuideBadges } from "@/hooks/badge/useBadge";
import { mapBadgeIdsToBadges } from "@/utils/badge-utils";
import { useMemo } from "react";

interface ProfileHeaderProps {
  profile: LocalGuideProfile;
  onEditProfile?: () => void;
}

export function ProfileHeader({ profile, onEditProfile }: ProfileHeaderProps) {
  const { data: badgesData} = useGuideBadges(
    profile._id,
    profile.verificationStatus === "verified"
  );

  // Fallback: Use badges from profile if API fails or is loading
  const displayBadges = useMemo(() => {
    // If API data is available and has badges, use it
    if (badgesData && badgesData.allBadges && badgesData.allBadges.length > 0) {
      return badgesData.allBadges;
    }

    // Otherwise, use profile badges as fallback
    if (profile.badges && profile.badges.length > 0) {
      return mapBadgeIdsToBadges(profile.badges);
    }

    return [];
  }, [badgesData, profile.badges]);

  const earnedBadgeIds = useMemo(() => {
    if (
      badgesData &&
      badgesData.earnedBadges &&
      badgesData.earnedBadges.length > 0
    ) {
      return badgesData.earnedBadges;
    }
    return profile.badges || [];
  }, [badgesData, profile.badges]);

  const getStatusConfig = (status: LocalGuideProfile["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          icon: CheckCircle,
          className: "bg-emerald-500/20 text-emerald-700 border-emerald-400/30",
        };
      case "pending":
        return {
          label: "Pending Verification",
          icon: Clock,
          className: "bg-amber-500/20 text-amber-700 border-amber-400/30",
        };
      case "reviewing":
        return {
          label: "Under Review",
          icon: Clock,
          className: "bg-blue-500/20 text-blue-700 border-blue-400/30",
        };
      case "rejected":
        return {
          label: "Rejected",
          icon: X,
          className: "bg-rose-500/20 text-rose-700 border-rose-400/30",
        };
      default:
        return {
          label: "Unknown",
          icon: X,
          className: "bg-neutral-500/20 text-neutral-700 border-neutral-400/30",
        };
    }
  };

  const statusConfig = getStatusConfig(profile.verificationStatus);
  const StatusIcon = statusConfig.icon;

  const userDetails = profile.userDetails;
  const displayName = userDetails
    ? `${userDetails.firstName} ${userDetails.lastName}`
    : "Local Guide";
  const profileImage =
    profile.profileImage || userDetails?.profileImage || "/placeholder.svg";

  return (
    <Card className="border-0 shadow-2xl overflow-hidden relative">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent"></div>

      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-300/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-300/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-xl"></div>
            <Avatar className="relative h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-white shadow-xl">
              <AvatarImage
                src={profileImage}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl sm:text-3xl font-bold">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {profile.verificationStatus === "verified" && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg">
                <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500" />
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {displayName}
                </h1>
                {userDetails?.email && (
                  <p className="text-neutral-600 text-sm mb-3 truncate">
                    {userDetails.email}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className={`${statusConfig.className} border font-medium text-xs px-3 py-1`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                  {profile.location && (
                    <Badge
                      variant="outline"
                      className="border-neutral-400/40 bg-white/50 text-neutral-700 font-medium text-xs px-3 py-1"
                    >
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {profile.location.city}, {profile.location.state}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            {profile.verificationStatus === "verified" && (
              <>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-4 border-b border-neutral-200/50">
                  <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {profile.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-neutral-600">
                      ({profile.stats.totalRatings})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{profile.hourlyRate}/hr
                    </span>
                  </div>
                  {profile.stats.totalSessions > 0 && (
                    <div className="text-xs sm:text-sm text-neutral-700 bg-white/50 px-3 py-2 rounded-lg">
                      {profile.stats.completedSessions} of{" "}
                      {profile.stats.totalSessions} sessions completed
                    </div>
                  )}
                </div>

                {/* Badges Section */}
                {displayBadges.length > 0 && earnedBadgeIds.length > 0 && (
                  <div className="w-full max-w-xl text-center">
                    <BadgeDisplay
                      badges={displayBadges}
                      maxDisplay={6}
                      size="lg"
                      compact={false}
                    />
                  </div>
                )}
              </>
            )}

            {/* Edit Button - Mobile */}
            {onEditProfile && profile.verificationStatus === "verified" && (
              <Button
                onClick={onEditProfile}
                className="sm:hidden w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                size="sm"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
