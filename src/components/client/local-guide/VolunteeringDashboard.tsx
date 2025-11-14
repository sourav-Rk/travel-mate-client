"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  Eye,
  Heart,
  CheckCircle,
  Plus,
  ExternalLink,
  TrendingUp,
  Globe,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useVolunteerPosts } from "@/hooks/volunteer-post/useVolunteerPost"
import { PostCard } from "../volunteer-post/PostCard"
import { Loader2 } from "lucide-react"
import { FeaturedPostCard } from "../volunteer-post/FeaturedPostCard"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface VolunteeringDashboardProps {
  profile: {
    _id: string
    userDetails?: {
      firstName: string
      lastName: string
      profileImage?: string
    }
    stats: {
      totalPosts: number
      totalSessions: number
      completedSessions: number
      averageRating: number
      totalRatings: number
      totalEarnings: number
    }
    verificationStatus: string
  }
  myPosts: any[]
  isLoadingMyPosts: boolean
}

export function VolunteeringDashboard({
  profile,
  myPosts,
  isLoadingMyPosts,
}: VolunteeringDashboardProps) {
  const navigate = useNavigate()

  // Check if verification is pending
  const isVerificationPending = profile.verificationStatus === "pending"

  /**
   * Calculate aggregated stats from posts
   */
  const totalViews = myPosts.reduce((sum, post) => sum + (post.views || 0), 0)
  const totalLikes = myPosts.reduce((sum, post) => sum + (post.likes || 0), 0)
  const publishedPosts = myPosts.filter((post) => post.status === "published").length

  /**
   *  Fetch featured posts for logged-in users 
   */
  const { data: featuredPostsData, isLoading: isLoadingFeaturedPosts } =
    useVolunteerPosts({ status: "published", limit: 6, sortBy: "newest" }, true)

  const firstName = profile.userDetails?.firstName || "Guide"
  const lastName = profile.userDetails?.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim() || "Local Guide"
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "LG"

  // Show verification pending message if verification is pending
  if (isVerificationPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <Card className="border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-amber-100 rounded-full">
                  <Clock className="h-12 w-12 text-amber-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Verification in Progress
              </h2>
              <p className="text-slate-600 mb-6">
                Your local guide profile is currently under review by our admin team. 
                Please wait for verification to be completed before you can access the dashboard, 
                create posts, or manage your volunteer activities.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Verification typically takes 24-48 hours
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent">
      {/* Welcome Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-[#2CA4BC]/30">
                <AvatarImage
                  src={profile.userDetails?.profileImage}
                  alt={fullName}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] text-white font-semibold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage your volunteer posts and share your local knowledge
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/pvt/local-guide/profile")}
              className="border-[#2CA4BC]/30 text-[#2CA4BC] hover:bg-[#2CA4BC]/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-slate-200 hover:border-[#2CA4BC]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Posts</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {profile.stats.totalPosts || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-[#2CA4BC]/10 rounded-lg">
                    <FileText className="h-6 w-6 text-[#2CA4BC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-[#2CA4BC]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-slate-900">{totalViews}</p>
                  </div>
                  <div className="p-3 bg-[#2CA4BC]/10 rounded-lg">
                    <Eye className="h-6 w-6 text-[#2CA4BC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-[#2CA4BC]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Likes</p>
                    <p className="text-3xl font-bold text-slate-900">{totalLikes}</p>
                  </div>
                  <div className="p-3 bg-[#2CA4BC]/10 rounded-lg">
                    <Heart className="h-6 w-6 text-[#2CA4BC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-[#2CA4BC]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Published</p>
                    <p className="text-3xl font-bold text-slate-900">{publishedPosts}</p>
                  </div>
                  <div className="p-3 bg-[#2CA4BC]/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-[#2CA4BC]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/pvt/posts/create")}
              className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Post
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pvt/my-posts")}
              className="flex-1 border-2 border-[#2CA4BC] text-[#2CA4BC] hover:bg-[#2CA4BC]/10"
            >
              <FileText className="h-5 w-5 mr-2" />
              View My Posts
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/volunteer-posts")}
              className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Globe className="h-5 w-5 mr-2" />
              Browse All Posts
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
              {myPosts.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/pvt/my-posts")}
                  className="text-[#2CA4BC] hover:text-[#1a5f6b]"
                >
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

              {isLoadingMyPosts ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
                </div>
              ) : myPosts.length === 0 ? (
                <Card className="border-slate-200">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">You haven't created any posts yet.</p>
                    <Button
                      onClick={() => navigate("/pvt/posts/create")}
                      className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myPosts.slice(0, 3).map((post, index) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      index={index}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

      {/* Featured Posts Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#2CA4BC]" />
            Featured Posts
          </h2>
          <p className="text-slate-600 mt-1">
            Discover popular posts from other local guides
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/volunteer-posts")}
          className="text-[#2CA4BC] hover:text-[#1a5f6b]"
        >
          Explore All <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {isLoadingFeaturedPosts ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2CA4BC]" />
        </div>
      ) : featuredPostsData?.posts && featuredPostsData.posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPostsData.posts.slice(0, 6).map((post: any, index: number) => (
            <FeaturedPostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No featured posts available at the moment.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  </div>
</section>
    </div>
  )
}