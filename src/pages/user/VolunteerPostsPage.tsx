import { VolunteerPostLayout } from "@/components/client/volunteer-post/VolunteerPostLayout";
import { PostList } from "@/components/client/volunteer-post/PostList";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

export default function VolunteerPostsPage() {
  const { isLoggedIn } = useClientAuth();

  return (
    <VolunteerPostLayout>
      {/* Hero Header Section */}
      <div className="mb-8 relative">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2CA4BC]/5 via-[#2CA4BC]/10 to-transparent rounded-3xl -z-10"></div>
        
        <Card className="border-none shadow-xl bg-gradient-to-br from-white via-white to-[#2CA4BC]/5 backdrop-blur-sm overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#2CA4BC]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1a5f6b]/10 to-transparent rounded-full blur-2xl"></div>
          
          <CardContent className="p-6 md:p-8 relative">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#2CA4BC] to-[#1a5f6b] shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                  Volunteer Posts
                </h1>
                <p className="text-slate-600 text-base md:text-lg max-w-2xl">
                  Discover local insights and hidden gems shared by our community guides. 
                  Explore authentic experiences from passionate locals.
                </p>
              </div>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#2CA4BC]/20 shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#2CA4BC]" />
                <span className="text-sm font-medium text-slate-700">Latest Posts</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#2CA4BC]/20 shadow-sm">
                <Clock className="w-4 h-4 text-[#2CA4BC]" />
                <span className="text-sm font-medium text-slate-700">Updated Daily</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10 backdrop-blur-sm border border-[#2CA4BC]/30 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#2CA4BC]" />
                <span className="text-sm font-medium text-[#1a5f6b]">Verified Guides</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List with wrapper for better styling */}
      <div className="relative">
        {/* Subtle gradient border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2CA4BC]/20 via-transparent to-[#1a5f6b]/20 rounded-2xl blur-xl opacity-50"></div>
        <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
          <PostList />
        </div>
      </div>
    </VolunteerPostLayout>
  );
}