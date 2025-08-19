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
import { logoutClient } from "@/services/auth/authService";
import toast from "react-hot-toast";
import { clientLogout } from "@/store/slices/clientSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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

  const { mutate: logoutClientMutate } = useLogout(logoutClient);

  const logoutUser = () => {
    logoutClientMutate(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatch(clientLogout());
        setIsOpen(false);
        navigate("/");
      },
      onError: (error: any) => {
        toast.error(error);
      },
    });
  };

  const { firstName } = useSelector((state: RootState) => state.client.client);

  const navigationItems = [
    { title: "Profile", href: "/profile", icon: User },
    { title: "My Bookings", href: "/bookings", icon: Calendar },
    { title: "Wallet", href: "/wallet", icon: Wallet },
    { title: "Bucket List", href: "/bucket-list", icon: Heart },
    { title: "Messages", href: "/messages", icon: MessageCircle },
    { title: "Volunteering", href: "/volunteering", icon: UserPlus },
    { title: "Groups", href: "/groups", icon: Users },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavClick = (href: any) => {
    setActiveItem(href);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-slate-50 to-blue-50/50 border-r border-slate-200/60">
      {/* Header Section */}
      <div className="bg-[#2CA4BC] text-white p-3">
        {/* User Info Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={user.avatar}
              alt="Travel Mate"
              className="h-20 w-20  object-cover"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 "></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-1">{firstName}</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
        <div className="space-y-1 min-h-fit">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-[#2CA4BC] text-white shadow-lg shadow-[#2CA4BC]/25 transform scale-[1.02]"
                    : "text-slate-700 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 hover:scale-[1.01] hover:text-teal-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-teal-500"
                  }`}
                />
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Separator */}
      <div className="px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>

      {/* Logout Section */}
      <div className="p-6">
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:shadow-md hover:shadow-red-100/50 hover:scale-[1.01] transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/60 hover:bg-white hover:shadow-xl transition-all duration-200"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-slate-700" />
        ) : (
          <Menu className="h-5 w-5 text-slate-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Fixed Position */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden md:flex h-screen w-80 flex-col shadow-xl ${className}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-80 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </div>
  );
};

export default ClientSidebar;
