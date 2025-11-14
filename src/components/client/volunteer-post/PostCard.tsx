import { motion } from "framer-motion";
import { MapPin, Eye, Heart, Calendar, Tag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useLikeVolunteerPost, useUnlikeVolunteerPost } from "@/hooks/volunteer-post/useVolunteerPost";
import toast from "react-hot-toast";
import type { VolunteerPost } from "@/types/volunteer-post";

interface PostCardProps {
  post: VolunteerPost;
  index?: number;
  showActions?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({
  post,
  index = 0,
  showActions = false,
  onEdit,
  onDelete,
}: PostCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useClientAuth();
  const { mutateAsync: likePost, isPending: isLiking } = useLikeVolunteerPost();
  const { mutateAsync: unlikePost, isPending: isUnliking } = useUnlikeVolunteerPost();

  const isLiked = post.isLiked || false;
  const isPending = isLiking || isUnliking;

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "hidden":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewPost = () => {
    navigate(`/volunteer-posts/${post._id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please log in to like posts");
      navigate("/login");
      return;
    }

    try {
      if (isLiked) {
        const response = await unlikePost(post._id);
        toast.success(response.message);
      } else {
        const response = await likePost(post._id);
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update like");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border border-slate-200 hover:border-[#2CA4BC]/30 bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-80 h-48 md:h-auto relative overflow-hidden">
            <img
              src={
                post.images && post.images.length > 0
                  ? post.images[0]
                  : "/placeholder.svg?height=200&width=320&query=volunteer post"
              }
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category Badge */}
            <Badge
              className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}
            >
              {post.category.replace("-", " ")}
            </Badge>

            {/* Status Badge */}
            {showActions && (
              <Badge
                className={`absolute top-3 right-3 ${getStatusColor(post.status)}`}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Badge>
            )}

            {/* Guide Service Badge */}
            {post.offersGuideService && (
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-[#2CA4BC]/90 backdrop-blur-md rounded-full">
                <span className="text-white text-xs font-medium flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Guide Service
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#2CA4BC] transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {post.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <MapPin className="w-4 h-4 text-[#2CA4BC]" />
                  <span>
                    {post.location.city}, {post.location.state}
                  </span>
                  {post.distance && (
                    <>
                      <span>•</span>
                      <span>{Math.round(post.distance / 1000)} km away</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
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
                    className={`h-auto p-1 hover:bg-red-50 transition-colors cursor-pointer ${
                      isLiked ? "text-red-500 hover:text-red-600" : "text-slate-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <span>{post.likes} likes</span>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#2CA4BC]" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleViewPost}
                  className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white py-2.5 px-4 rounded-lg hover:shadow-lg hover:shadow-[#2CA4BC]/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Post
                </button>
                {showActions && onEdit && (
                  <button
                    onClick={() => onEdit(post._id)}
                    className="px-4 py-2.5 border border-[#2CA4BC]/30 text-[#1a5f6b] rounded-lg hover:bg-[#2CA4BC]/5 hover:border-[#2CA4BC]/50 transition-all duration-300"
                  >
                    Edit
                  </button>
                )}
                {showActions && onDelete && (
                  <button
                    onClick={() => onDelete(post._id)}
                    className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

