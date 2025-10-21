
import { useState } from "react";
import {
  User,
  Calendar,
  Wallet,
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useLogout } from "@/hooks/auth/useLogout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";

const ClientSidebar = ({
  user = {
    avatar: "/Travel_Mate_Logo.png",
    initials: "SJ",
  },
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: logoutClientMutate } = useLogout();

  const logout = () => {
    logoutClientMutate(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatch(logoutUser());
        setIsOpen(false);
        navigate("/");
      },
      onError: (error: any) => {
        toast.error(error);
      },
    });
  };

  const {firstName} = useSelector((state: RootState) => state.user.user);

  const navigationItems = [
    { title: "Profile", href: "/pvt/profile", icon: User },
    { title: "My Bookings", href: "/pvt/bookings", icon: Calendar },
    { title: "Wallet", href: "/pvt/wallet", icon: Wallet },
    { title: "Bucket List", href: "/pvt/wishlist", icon: Heart },
    { title: "Messages", href: "/chat", icon: MessageCircle },
    { title: "Volunteering", href: "/volunteering", icon: UserPlus },
    { title: "Groups", href: "/groups", icon: Users },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavClick = (href: any) => {
    setActiveItem(href);
    setIsOpen(false);
    navigate(href)

  };

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2CA4BC]/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex h-full w-full flex-col border-r border-slate-200/60 backdrop-blur-sm">
        {/* Header Section with Travel Theme */}
        <div className="relative bg-gradient-to-r from-[#2CA4BC] via-[#2CA4BC] to-[#238A9F] text-white p-6 shadow-lg">
          {/* Decorative Travel Icons */}
          <div className="absolute top-2 right-4 opacity-20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-1 h-1 rounded-full bg-white/10"></div>
            </div>
          </div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
            <div className="absolute bottom-4 right-6 w-4 h-4 border border-white/20 rotate-45"></div>
          </div>

          {/* User Info Section */}
          <div className="relative flex flex-col items-center">
            <div onClick={() => navigate("/home")} className="relative mb-4 group cursor-pointer">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 group-hover:border-white/30 transition-all duration-300">
                <img
                  src={user.avatar}
                  alt="Travel Mate"
                  className="h-16 w-16 object-cover rounded-full border-2 border-white/30"
                />
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-1 tracking-wide">
                {firstName}
              </p>
              <p className="text-teal-100 text-sm font-medium">Travel Explorer</p>
            </div>
          </div>
        </div>

        {/* Navigation Section with Enhanced Styling */}
        <nav className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          <div className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-[#2CA4BC] to-[#238A9F] text-white shadow-xl shadow-[#2CA4BC]/30 transform scale-[1.02]"
                      : "text-slate-700 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60 hover:scale-[1.01] hover:text-teal-600 bg-white/50 border border-slate-200/50 hover:border-teal-200"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Animated Background for Active State */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                  )}
                  
                  {/* Icon Container with Enhanced Styling */}
                  <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 shadow-lg"
                      : "bg-slate-100 group-hover:bg-teal-50 group-hover:shadow-md"
                  }`}>
                    <Icon
                      className={`h-5 w-5 transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-600 group-hover:text-teal-600"
                      }`}
                    />
                  </div>
                  
                  <span className="font-semibold tracking-wide relative z-10">
                    {item.title}
                  </span>
                  
                  {/* Hover Effect Indicator */}
                  <div className={`absolute right-4 w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-white/60"
                      : "bg-transparent group-hover:bg-teal-400"
                  }`}></div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Decorative Separator with Travel Theme */}
        <div className="px-6 py-2">
          <div className="relative h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-[#2CA4BC]"></div>
          </div>
        </div>

        {/* Enhanced Logout Section */}
        <div className="p-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-lg hover:shadow-red-100/50 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden bg-white/50 border border-red-200/50 hover:border-red-300"
          >
            {/* Icon Container */}
            <div className="relative p-2 rounded-xl bg-red-50 group-hover:bg-red-100 group-hover:shadow-md transition-all duration-300">
              <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors duration-300" />
            </div>
            
            <span className="font-semibold tracking-wide">Logout</span>
            
            {/* Subtle Animation Effect */}
            <div className="absolute right-4 w-2 h-2 rounded-full bg-transparent group-hover:bg-red-400 transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Enhanced Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/60 hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <div className="relative">
          {isOpen ? (
            <X className="h-6 w-6 text-slate-700 group-hover:text-[#2CA4BC] transition-colors duration-300" />
          ) : (
            <Menu className="h-6 w-6 text-slate-700 group-hover:text-[#2CA4BC] transition-colors duration-300" />
          )}
        </div>
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2CA4BC]/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Enhanced Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Enhanced */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden md:flex h-screen w-80 flex-col shadow-2xl ${className}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Enhanced */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-80 transform transition-all duration-300 ease-out md:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </div>
  );
};

export default ClientSidebar;