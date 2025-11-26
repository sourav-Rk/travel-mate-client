import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Clock,
  Languages,
  Award,
  Eye,
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  TrendingUp,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useCreateGuideChatRoom } from "@/hooks/guide-chat/useGuideChat";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicGuideProfile } from "@/hooks/local-guide/usePublicGuideProfile";
import { BadgeDisplay } from "@/components/local-guide-badges/BadgeDisplay";
import { mapBadgeIdsToBadges } from "@/utils/badge-utils";

export function LocalGuideDetails() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, clientInfo } = useClientAuth();
  const { mutateAsync: openGuideChat, isPending: isOpeningChat } = useCreateGuideChatRoom();
  
  const { data: guide, isLoading, error } = usePublicGuideProfile(profileId || "");

  const guideDetails = guide?.profile;

  const handleContactGuide = async () => {
    if (!isLoggedIn || !clientInfo?.id) {
      toast.error("Please log in to contact this guide");
      navigate("/login");
      return;
    }

    if (!guideDetails?._id || !guideDetails.userId) {
      toast.error("Guide details are missing");
      return;
    }

    if (guideDetails.userId === clientInfo.id) {
      toast.error("You cannot chat with yourself");
      return;
    }

    try {
      const response = await openGuideChat({
        travellerId: clientInfo.id,
        guideId: guideDetails.userId,
        guideProfileId: guideDetails._id,
      });
      navigate("/volunteering/guide-chat", {
        state: { guideChatRoomId: response.room._id },
      });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Unable to start chat right now";
      toast.error(message);
    }
  };

  if (isLoading) {
    return <GuideDetailsSkeleton />;
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">Guide Not Found</h2>
          <p className="text-neutral-600 mb-8 text-lg">The guide profile you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate("/volunteer-posts")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  const userDetails = guide.profile.userDetails;
  const stats = guide.profile.stats;

  // Transform badges for BadgeDisplay component
 const transformedBadges = guideDetails?.badges 
    ? mapBadgeIdsToBadges(guideDetails.badges)
    : [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50">
      {/* Hero Section with Cover */}
      <div className="relative">
        {/* Cover Image/Gradient */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-cyan-600 via-cyan-600 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }} />
          
          {/* Back Button */}
          <div className="absolute top-6 left-4 md:left-8 z-10">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white bg-black/20 backdrop-blur-sm hover:bg-black/30 border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Profile Section Overlay */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative -mt-20 md:-mt-24">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Image */}
                <div className="relative shrink-0 mx-auto md:mx-0">
                  {guideDetails?.profileImage || userDetails?.profileImage ? (
                    <img
                      src={guideDetails?.profileImage || userDetails?.profileImage}
                      alt={`${userDetails?.firstName} ${userDetails?.lastName}`}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-4 ring-white shadow-xl">
                      <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute -bottom-2 -right-2">
                    {guideDetails?.isAvailable ? (
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 border-2 border-white">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Available
                      </div>
                    ) : (
                      <div className="bg-neutral-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg border-2 border-white">
                        Unavailable
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                    {userDetails?.firstName} {userDetails?.lastName}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{guideDetails?.location.city}, {guideDetails?.location.state}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{stats.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-amber-600">({stats.totalRatings})</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">₹{guideDetails?.hourlyRate}</span>
                      <span className="text-xs text-emerald-600">/hour</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {guideDetails?.bio && (
                    <p className="text-neutral-600 leading-relaxed mb-4 max-w-3xl">
                      {guideDetails.bio}
                    </p>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button
                      onClick={handleContactGuide}
                      disabled={isOpeningChat || !guideDetails?.isAvailable || guideDetails?.userId === clientInfo?.id}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-black-700 hover:to-black-700 text-white shadow-lg hover:shadow-xl transition-all px-6"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {guideDetails?.userId === clientInfo?.id
                        ? "You are the guide"
                        : !guideDetails?.isAvailable
                        ? "Currently Unavailable"
                        : isOpeningChat
                        ? "Starting Chat..."
                        : "Contact Guide"}
                    </Button>
                    
                  </div>
                </div>
              </div>

              {/* Availability Note */}
              {guideDetails?.availabilityNote && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Availability Note</h4>
                      <p className="text-blue-800 text-sm leading-relaxed">{guideDetails.availabilityNote}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-700 mb-1">{stats.completedSessions}</div>
                <div className="text-sm text-blue-600 font-medium">Sessions Completed</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.completionRate}%</div>
                <div className="text-sm text-emerald-600 font-medium">Completion Rate</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                <div className="text-3xl font-bold text-purple-700 mb-1">{stats.totalPosts}</div>
                <div className="text-sm text-purple-600 font-medium">Total Posts</div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-center gap-2 text-neutral-700 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">{stats.totalViews}</span>
                </div>
                <div className="text-xs text-neutral-600 font-medium">Profile Views</div>
              </div>
              
              <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-center gap-2 text-neutral-700 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold">{stats.totalLikes}</span>
                </div>
                <div className="text-xs text-neutral-600 font-medium">Total Likes</div>
              </div>
              
              <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-center gap-2 text-neutral-700 mb-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-neutral-600 font-medium">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Languages & Specialties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Languages className="w-5 h-5 text-white" />
                </div>
                <span>Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {guideDetails?.languages.map((language, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium hover:from-blue-100 hover:to-cyan-100 transition-all"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span>Specialties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {guideDetails?.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium hover:from-purple-100 hover:to-pink-100 transition-all"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
           {transformedBadges.length > 0 && (
          <Card className="border-0 shadow-xl rounded-3xl overflow-visible">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span>Achievement Badges ({transformedBadges.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-visible">
              <BadgeDisplay
                badges={transformedBadges}
                size="sm"
                compact={true}
                showFilters={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDetails?.email && (
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-neutral-500 mb-0.5">Email</div>
                    <div className="text-sm font-medium text-neutral-900 truncate">{userDetails.email}</div>
                  </div>
                </div>
              )}
              
              {userDetails?.phone && (
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-neutral-500 mb-0.5">Phone</div>
                    <div className="text-sm font-medium text-neutral-900">{userDetails.phone}</div>
                  </div>
                </div>
              )}
              
              {userDetails?.gender && (
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-neutral-500 mb-0.5">Gender</div>
                    <div className="text-sm font-medium text-neutral-900 capitalize">{userDetails.gender}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton Loader
function GuideDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50">
      <div className="h-64 md:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative -mt-20 md:-mt-24">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-3xl mx-auto md:mx-0" />
              <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
                <div className="flex gap-3 justify-center md:justify-start">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-3 justify-center md:justify-start">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}