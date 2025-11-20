// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useVolunteerPost,
//   useLikeVolunteerPost,
//   useUnlikeVolunteerPost,
// } from "@/hooks/volunteer-post/useVolunteerPost";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MapPin,
//   Eye,
//   Heart,
//   Calendar,
//   Tag,
//   User,
//   ArrowLeft,
//   Loader2,
// } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { useClientAuth } from "@/hooks/auth/useAuth";
// import { useCreateGuideChatRoom } from "@/hooks/guide-chat/useGuideChat";
// import toast from "react-hot-toast";
// import { useGuideBadges } from "@/hooks/badge/useBadge";
// import { useMemo } from "react";
// import { GuidePublicProfileCard } from "../local-guide/GuidePublicProfileCard";
// import { BadgeDisplay } from "@/components/local-guide-badges/BadgeDisplay";

// export function PostDetail() {
//   const { postId } = useParams<{ postId: string }>();
//   const navigate = useNavigate();
//   const { isLoggedIn, clientInfo } = useClientAuth();
//   const { data, isLoading, error } = useVolunteerPost(postId || "", true);
//   const { mutateAsync: likePost, isPending: isLiking } = useLikeVolunteerPost();
//   const { mutateAsync: unlikePost, isPending: isUnliking } =
//     useUnlikeVolunteerPost();
//   const { mutateAsync: openGuideChat, isPending: isOpeningChat } =
//     useCreateGuideChatRoom();

//   // Always call hooks before any conditional returns
//   const guideProfileId = data?.post?.localGuideProfileId || "";
//   const { data: badgesData } = useGuideBadges(guideProfileId, !!guideProfileId);

//   const displayBadges = useMemo(() => {
//     if (badgesData?.allBadges?.length) {
//       return badgesData.allBadges;
//     }
//     return [];
//   }, [badgesData]);

//   const earnedBadgeIds = useMemo(() => {
//     if (badgesData?.earnedBadges?.length) {
//       return badgesData.earnedBadges;
//     }
//     return [];
//   }, [badgesData]);
//   const handleContactGuide = async () => {
//     if (!isLoggedIn || !clientInfo?.id) {
//       toast.error("Login to chat with local guides");
//       navigate("/login");
//       return;
//     }

//     if (!guide?._id || !guide.userId) {
//       toast.error("Guide details are missing");
//       return;
//     }

//     if (guide.userId === clientInfo.id) {
//       toast.error("You cannot chat with yourself as the guide.");
//       return;
//     }

//     try {
//       const response = await openGuideChat({
//         travellerId: clientInfo.id,
//         guideId: guide.userId,
//         guideProfileId: guide._id,
//         postId: post._id,
//       });
//       navigate("/volunteering/guide-chat", {
//         state: { guideChatRoomId: response.room._id },
//       });
//     } catch (err) {
//       const message =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Unable to start chat right now";
//       toast.error(message);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
//       </div>
//     );
//   }

//   if (error || !data?.post) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-slate-600 mb-4">Post not found</p>
//         <Button
//           onClick={() => navigate("/volunteer-posts")}
//           className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Posts
//         </Button>
//       </div>
//     );
//   }

//   const post = data.post;
//   const guide = post.guideDetails;
//   const isLiked = post.isLiked || false;
//   const isPending = isLiking || isUnliking;

//   const handleLike = async () => {
//     if (!isLoggedIn) {
//       toast.error("Please log in to like posts");
//       navigate("/login");
//       return;
//     }

//     try {
//       if (isLiked) {
//         await unlikePost(post._id);
//         toast.success("Post unliked");
//       } else {
//         await likePost(post._id);
//         toast.success("Post liked");
//       }
//     } catch (err) {
//       const message =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Failed to update like";
//       toast.error(message);
//     }
//   };

//   const formatDate = (date: Date | string) => {
//     const d = typeof date === "string" ? new Date(date) : date;
//     return d.toLocaleDateString("en-US", {
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: Record<string, string> = {
//       "hidden-spots": "bg-purple-100 text-purple-700",
//       restaurants: "bg-orange-100 text-orange-700",
//       safety: "bg-red-100 text-red-700",
//       culture: "bg-amber-100 text-amber-700",
//       stays: "bg-blue-100 text-blue-700",
//       transportation: "bg-green-100 text-green-700",
//       shopping: "bg-pink-100 text-pink-700",
//       entertainment: "bg-indigo-100 text-indigo-700",
//       nature: "bg-emerald-100 text-emerald-700",
//       history: "bg-amber-100 text-amber-700",
//       other: "bg-gray-100 text-gray-700",
//     };
//     return colors[category] || colors.other;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50 py-8 px-4 md:px-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="text-slate-600 hover:text-[#2CA4BC]"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </Button>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Post Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Header Card */}
//             <Card className="border-slate-200 shadow-lg">
//               <CardHeader>
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Badge className={getCategoryColor(post.category)}>
//                         {post.category.replace("-", " ")}
//                       </Badge>
//                       {post.offersGuideService && (
//                         <Badge className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20">
//                           <User className="w-3 h-3 mr-1" />
//                           Guide Service Available
//                         </Badge>
//                       )}
//                     </div>
//                     <CardTitle className="text-3xl mb-3">
//                       {post.title}
//                     </CardTitle>
//                     <p className="text-slate-600 text-lg">{post.description}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {/* Location */}
//                 <div className="flex items-center gap-2 text-slate-600 mb-4">
//                   <MapPin className="w-5 h-5 text-[#2CA4BC]" />
//                   <span className="font-medium">
//                     {post.location.city}, {post.location.state},{" "}
//                     {post.location.country}
//                   </span>
//                   {post.distance && (
//                     <span className="text-slate-400">
//                       • {Math.round(post.distance / 1000)} km away
//                     </span>
//                   )}
//                 </div>

//                 {/* Stats */}
//                 <div className="flex items-center gap-6 text-slate-600 mb-6">
//                   <div className="flex items-center gap-1">
//                     <Eye className="w-4 h-4 text-[#2CA4BC]" />
//                     <span>{post.views} views</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={handleLike}
//                       disabled={isPending || !isLoggedIn}
//                       title={isLiked ? "Click to unlike" : "Click to like"}
//                       className={`h-auto p-2 hover:bg-red-50 transition-colors cursor-pointer ${
//                         isLiked
//                           ? "text-red-500 hover:text-red-600"
//                           : "text-slate-600 hover:text-red-500"
//                       }`}
//                     >
//                       <Heart
//                         className={`w-5 h-5 transition-all ${
//                           isLiked ? "fill-red-500 text-red-500" : ""
//                         }`}
//                       />
//                     </Button>
//                     <span>{post.likes} likes</span>
//                   </div>
//                   {post.publishedAt && (
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4 text-[#2CA4BC]" />
//                       <span>Published {formatDate(post.publishedAt)}</span>
//                     </div>
//                   )}
//                 </div>

//                 <Separator className="my-6" />

//                 {/* Content */}
//                 <div className="prose max-w-none">
//                   <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
//                     {post.content}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Images */}
//             {post.images && post.images.length > 0 && (
//               <Card className="border-slate-200 shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-xl">Images</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {post.images.map((image, idx) => (
//                       <div
//                         key={idx}
//                         className="relative overflow-hidden rounded-lg"
//                       >
//                         <img
//                           src={image}
//                           alt={`${post.title} - Image ${idx + 1}`}
//                           className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Tags */}
//             {post.tags && post.tags.length > 0 && (
//               <Card className="border-slate-200 shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-xl flex items-center gap-2">
//                     <Tag className="w-5 h-5 text-[#2CA4BC]" />
//                     Tags
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-2">
//                     {post.tags.map((tag, idx) => (
//                       <Badge
//                         key={idx}
//                         variant="secondary"
//                         className="bg-slate-100 text-slate-700"
//                       >
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar - Guide Info */}
//           {guide && (
//             <div className="space-y-6">
//               <Card className="border-slate-200 shadow-lg sticky top-6">
//                 <CardHeader className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white">
//                   <CardTitle className="text-xl">Local Guide</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-6 space-y-4">
//                   {guideProfileId ? (
//                     <GuidePublicProfileCard profileId={guideProfileId} />
//                   ) : (
//                     <p className="text-sm text-slate-500 text-center">
//                       Guide details unavailable.
//                     </p>
//                   )}

//                   {displayBadges.length > 0 && earnedBadgeIds.length > 0 && (
//                     <>
//                       <Separator className="my-4" />
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 mb-3">
//                           Badges ({earnedBadgeIds.length})
//                         </p>
//                         <BadgeDisplay
//                           badges={displayBadges}
//                           maxDisplay={4}
//                           size="sm"
//                           compact
//                         />
//                       </div>
//                     </>
//                   )}

//                   {post.offersGuideService && guideProfileId && (
//                     <>
//                       <Separator className="my-4" />
//                       <Button
//                         className="w-full bg-gradient-to-r from-[#F5F1E8] via-[#F5F1E8]/80 to-transparent text-[#8C6A3B] border border-[#E3D5C5] hover:bg-[#F5F1E8]"
//                         onClick={handleContactGuide}
//                         disabled={
//                           isOpeningChat || guide?.userId === clientInfo?.id
//                         }
//                       >
//                         {guide?.userId === clientInfo?.id
//                           ? "You are the guide"
//                           : isOpeningChat
//                           ? "Starting chat..."
//                           : "Chat with this guide"}
//                       </Button>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import {
  useVolunteerPost,
  useLikeVolunteerPost,
  useUnlikeVolunteerPost,
} from "@/hooks/volunteer-post/useVolunteerPost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Eye,
  Heart,
  Calendar,
  Tag,
  User,
  ArrowLeft,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useCreateGuideChatRoom } from "@/hooks/guide-chat/useGuideChat";
import toast from "react-hot-toast";
import { useGuideBadges } from "@/hooks/badge/useBadge";
import { useMemo } from "react";

export function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, clientInfo } = useClientAuth();
  const { data, isLoading, error } = useVolunteerPost(postId || "", true);
  const { mutateAsync: likePost, isPending: isLiking } = useLikeVolunteerPost();
  const { mutateAsync: unlikePost, isPending: isUnliking } =
    useUnlikeVolunteerPost();
  const { mutateAsync: openGuideChat, isPending: isOpeningChat } =
    useCreateGuideChatRoom();

  // Always call hooks before any conditional returns
  const guideProfileId = data?.post?.localGuideProfileId || "";
  const { data: badgesData } = useGuideBadges(guideProfileId, !!guideProfileId);

  const earnedBadgeIds = useMemo(() => {
    if (badgesData?.earnedBadges?.length) {
      return badgesData.earnedBadges;
    }
    return [];
  }, [badgesData]);

  const handleContactGuide = async () => {
    if (!isLoggedIn || !clientInfo?.id) {
      toast.error("Login to chat with local guides");
      navigate("/login");
      return;
    }

    if (!guide?._id || !guide.userId) {
      toast.error("Guide details are missing");
      return;
    }

    if (guide.userId === clientInfo.id) {
      toast.error("You cannot chat with yourself as the guide.");
      return;
    }

    try {
      const response = await openGuideChat({
        travellerId: clientInfo.id,
        guideId: guide.userId,
        guideProfileId: guide._id,
        postId: post._id,
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

  const handleViewGuideDetails = () => {
    if (guideProfileId) {
      navigate(`/local-guide/details/${guideProfileId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Post not found</p>
        <Button
          onClick={() => navigate("/volunteer-posts")}
          className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
      </div>
    );
  }

  const post = data.post;
  const guide = post.guideDetails;
  const isLiked = post.isLiked || false;
  const isPending = isLiking || isUnliking;

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to like posts");
      navigate("/login");
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post._id);
        toast.success("Post unliked");
      } else {
        await likePost(post._id);
        toast.success("Post liked");
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update like";
      toast.error(message);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "hidden-spots": "bg-purple-100 text-purple-700",
      restaurants: "bg-orange-100 text-orange-700",
      safety: "bg-red-100 text-red-700",
      culture: "bg-amber-100 text-amber-700",
      stays: "bg-blue-100 text-blue-700",
      transportation: "bg-green-100 text-green-700",
      shopping: "bg-pink-100 text-pink-700",
      entertainment: "bg-indigo-100 text-indigo-700",
      nature: "bg-emerald-100 text-emerald-700",
      history: "bg-amber-100 text-amber-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50 py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-slate-600 hover:text-[#2CA4BC]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category.replace("-", " ")}
                      </Badge>
                      {post.offersGuideService && (
                        <Badge className="bg-[#2CA4BC]/10 text-[#1a5f6b] border-[#2CA4BC]/20">
                          <User className="w-3 h-3 mr-1" />
                          Guide Service Available
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-3xl mb-3">
                      {post.title}
                    </CardTitle>
                    <p className="text-slate-600 text-lg">{post.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Location */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="w-5 h-5 text-[#2CA4BC]" />
                  <span className="font-medium">
                    {post.location.city}, {post.location.state},{" "}
                    {post.location.country}
                  </span>
                  {post.distance && (
                    <span className="text-slate-400">
                      • {Math.round(post.distance / 1000)} km away
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-slate-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-[#2CA4BC]" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={isPending || !isLoggedIn}
                      title={isLiked ? "Click to unlike" : "Click to like"}
                      className={`h-auto p-2 hover:bg-red-50 transition-colors cursor-pointer ${
                        isLiked
                          ? "text-red-500 hover:text-red-600"
                          : "text-slate-600 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                    <span>{post.likes} likes</span>
                  </div>
                  {post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#2CA4BC]" />
                      <span>Published {formatDate(post.publishedAt)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Content */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg"
                      >
                        <img
                          src={image}
                          alt={`${post.title} - Image ${idx + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#2CA4BC]" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Simplified Guide Info */}
          {guide && (
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-lg sticky top-6">
                <CardHeader className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white">
                  <CardTitle className="text-xl">Local Guide</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Profile Image and Basic Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-2 border-[#2CA4BC]">
                      {guide.profileImage ? (
                        <img
                          src={guide.profileImage}
                          alt={guide.firstName || "Guide"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {guide?.firstName+" "+ guide?.lastName || "Local Guide"}
                      </h3>
                    </div>
                  </div>

                  {/* Bio */}
                  {guide.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {guide.bio}
                      </p>
                    </div>
                  )}

                  {/* Gender */}
                  {guide.gender && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Gender</span>
                      <span className="text-sm font-medium text-slate-800">
                        {guide.gender}
                      </span>
                    </div>
                  )}

                  {/* Hourly Rate */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Hourly Rate</span>
                    <span className="text-sm font-bold text-[#1a5f6b]">
                      ₹{guide.hourlyRate}/hour
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Availability</span>
                    <Badge
                      className={
                        guide.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {guide.isAvailable ? "Available" : "Busy"}
                    </Badge>
                  </div>

                  {/* Languages */}
                  {guide.languages && guide.languages.length > 0 && (
                    <div className="py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600 block mb-2">
                        Languages
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {guide.languages.slice(0, 3).map((language, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {language}
                          </Badge>
                        ))}
                        {guide.languages.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{guide.languages.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {guide.specialties && guide.specialties.length > 0 && (
                    <div className="py-2">
                      <span className="text-sm text-slate-600 block mb-2">
                        Specialties
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {guide.specialties.slice(0, 3).map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-purple-50 text-purple-700"
                          >
                            {specialty}
                          </Badge>
                        ))}
                        {guide.specialties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{guide.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleViewGuideDetails}
                      variant="outline"
                      className="w-full border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC] hover:text-white"
                    >
                      View Guide Details
                    </Button>
                    
                    {post.offersGuideService && guideProfileId && (
                      <Button
                        onClick={handleContactGuide}
                        disabled={
                          isOpeningChat || guide?.userId === clientInfo?.id
                        }
                        className="w-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#1a5f6b] hover:to-[#2CA4BC]"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {guide?.userId === clientInfo?.id
                          ? "You are the guide"
                          : isOpeningChat
                          ? "Starting chat..."
                          : "Chat with Guide"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}