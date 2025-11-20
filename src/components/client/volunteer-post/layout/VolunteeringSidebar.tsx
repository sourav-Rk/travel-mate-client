import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Plus,
  Globe,
  User,
  X,
  MessageCircleHeartIcon,
  Calendar,
  HandCoinsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VolunteeringProfileCard } from "./VolunteeringProfileCard";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useLocalGuideProfileQuery } from "@/hooks/local-guide/useLocalGuideVerification";
import { useMyPosts } from "@/hooks/volunteer-post/useVolunteerPost";


interface VolunteeringSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  showWhen?: "logged-in" | "logged-out" | "always";
}

export function VolunteeringSidebar({
  isMobile = false,
  onClose,
}: VolunteeringSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useClientAuth();
  const { data: profile } = useLocalGuideProfileQuery(isLoggedIn);
  const { data: postsData } = useMyPosts(
    profile?._id || "",
    { limit: 100 }, 
    isLoggedIn && !!profile?._id
  );

  // Calculate stats from posts
  const totalViews = postsData?.posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const totalLikes = postsData?.posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/volunteering",
      icon: Home,
      showWhen: "always",
    },
    {
      title: "My Posts",
      href: "/pvt/my-posts",
      icon: FileText,
      showWhen: "logged-in",
    },
    {
      title: "Create Post",
      href: "/pvt/posts/create",
      icon: Plus,
      showWhen: "logged-in",
    },
    {
      title: "Browse Posts",
      href: "/volunteer-posts",
      icon: Globe,
      showWhen: "always",
    },
    {
      title: "Bookings",
      href: "/pvt/local-guide/bookings",
      icon: Calendar,
      showWhen: "always",
    },
    {
      title: "My Services",
      href: "/pvt/local-guide/my-service-bookings",
      icon: HandCoinsIcon,
      showWhen: "always",
    },
    {
      title: "Chats",
      href: "/volunteering/guide-chat",
      icon: MessageCircleHeartIcon,
      showWhen: "always",
    },
    {
      title: "Profile",
      href: "/pvt/local-guide/profile",
      icon: User,
      showWhen: "logged-in",
    },
  ];

  // Filter nav items based on login status
  const filteredNavItems = navItems.filter((item) => {
    if (item.showWhen === "always") return true;
    if (item.showWhen === "logged-in" && isLoggedIn) return true;
    if (item.showWhen === "logged-out" && !isLoggedIn) return true;
    return false;
  });

  const handleNavClick = (href: string) => {
    navigate(href);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActive = (href: string) => {
    if (href === "/volunteering") {
      return location.pathname === "/volunteering";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#F5F1E8]/95 via-[#F5F1E8]/80 to-transparent border-r border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-b border-slate-200/50 bg-white/40">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg lg:text-xl font-bold text-slate-900">Volunteering</h2>
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {!isLoggedIn && (
          <p className="text-xs lg:text-sm text-slate-600">
            Share your local knowledge with travelers
          </p>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Profile Card (when logged in) */}
        {isLoggedIn && profile && (
          <div className="p-3 lg:p-4 border-b border-slate-200/50">
            <VolunteeringProfileCard
              profile={profile}
              totalViews={totalViews}
              totalLikes={totalLikes}
            />
          </div>
        )}

        {/* CTA Card (when not logged in) */}
        {!isLoggedIn && (
          <div className="p-3 lg:p-4 border-b border-slate-200/50">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-[#2CA4BC]/20 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Become a Local Guide
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Share your city knowledge and earn money
              </p>
              <Button
                onClick={() => handleNavClick("/pvt/local-guide/verification")}
                className="w-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-xs h-8 shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-3 lg:p-4">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#2CA4BC] text-white shadow-md"
                      : "text-slate-700 hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : "text-slate-600"}`} />
                  <span className="truncate">{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Traveller Profile CTA */}
        {isLoggedIn && (
          <div className="px-3 lg:px-4 pb-3 lg:pb-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-lg p-3 lg:p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-amber-900 mb-1.5">
                Looking for Travel Packages?
              </h4>
              <p className="text-xs text-amber-700 mb-3">
                Explore curated travel experiences in your traveller profile
              </p>
              <Button
                onClick={() => handleNavClick("/pvt/profile")}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400 text-xs h-8"
              >
                Go to Traveller Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions / Footer */}
      <div className="flex-shrink-0 p-3 lg:p-4 border-t border-slate-200/50 bg-white/40">
        {isLoggedIn && (
          <Button
            onClick={() => handleNavClick("/pvt/posts/create")}
            className="w-full bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 shadow-lg text-sm py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        )}
        {!isLoggedIn && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleNavClick("/login")}
                className="text-xs lg:text-sm text-slate-600 hover:text-[#2CA4BC] hover:bg-[#2CA4BC]/5"
              >
                Sign In
              </Button>
              <span className="text-slate-400">•</span>
              <Button
                variant="ghost"
                onClick={() => handleNavClick("/signup")}
                className="text-xs lg:text-sm text-slate-600 hover:text-[#2CA4BC] hover:bg-[#2CA4BC]/5"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







