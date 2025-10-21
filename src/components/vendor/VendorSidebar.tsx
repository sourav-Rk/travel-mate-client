"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Package,
  Users,
  Zap,
  Activity,
  Star,
  MessageSquare,
  DollarSign,
  Users2,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth/useLogout";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/notification/useNotification";
import type {
  INotificationEntity,
  NotificationResponse,
} from "@/types/notificationType";
import {
  getNotificationsVendor,
  markAllNotificationReadVendor,
  markNotificationReadVendor,
} from "@/services/vendor/vendorService";
import { NotificationModal } from "../NotificationModal";
import { logoutUser } from "@/store/slices/userSlice";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const VendorSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("packages");
  const [notifications, setNotifications] = useState<INotificationEntity[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { firstname, email } = useSelector(
    (state: RootState) => state.user.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: markRead } = useMarkNotificationRead(
    markNotificationReadVendor
  );
  const { mutate: markAllRead } = useMarkAllNotificationsRead(
    markAllNotificationReadVendor
  );

  const { data: notifData, isLoading: notifLoading } =
    useGetNotifications<NotificationResponse>(
      ["notifications-client"],
      getNotificationsVendor
    );

  const navItems: NavItem[] = [
    {
      id: "packages",
      label: "Packages",
      icon: Package,
      path: "/vendor/packages",
    },
    { id: "users", label: "Users", icon: Users, path: "/vendor/users" },
    { id: "trams", label: "Trams", icon: Zap, path: "/vendor/trams" },
    {
      id: "actions",
      label: "Actions",
      icon: Activity,
      path: "/vendor/actions",
    },
    { 
      id: "cancellations", 
      label: "Cancellations", 
      icon: AlertCircle, 
      path: "/vendor/bookings/cancellations" 
    },
    { id: "reviews", label: "Reviews", icon: Star, path: "/vendor/reviews" },
    {
      id: "queries",
      label: "Queries",
      icon: MessageSquare,
      path: "/vendor/queries",
    },
    { id: "wallet", label: "Wallet", icon: DollarSign, path: "/vendor/wallet" },
    { id: "groups", label: "Groups", icon: Users2, path: "/vendor/groups" },
    { id: "guide", label: "Guide", icon: MapPin, path: "/vendor/guide" },
    { id: "profile", label: "Profile", icon: User, path: "/vendor/profile" },
  ];

  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (notifData) setNotifications(notifData.notifications || []);
  }, [notifData]);

  const unreadCount = notifications?.filter((n) => !n.isRead)?.length || 0;

  console.log(unreadCount, "unreadcount");

  const handleMarkRead = async (id: string) => {
    markRead(id, {
      onSuccess: (response) => {
        console.log(response.message);
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleLogout = (): void => {
    logout(undefined, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatch(logoutUser());
        navigate("/vendor");
      },
      onError: (error: any) => {
        toast.error(error);
      },
    });
  };

  const handleItemClick = (itemId: string, path: string): void => {
    setActiveItem(itemId);
    navigate(path);
    setIsOpen(false);
  };

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2CA4BC] text-white rounded-lg shadow-lg hover:bg-[#2CA4BC]/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-15 h-15  rounded-lg flex items-center justify-center p-1">
              <img
                src="/Travel_Mate_Logo.png"
                alt="Travel Mate Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Travel Mate</h1>
              <p className="text-sm text-gray-600">Vendor Portal</p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.path)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-[#2CA4BC] text-white shadow-md"
                    : "text-gray-700 hover:bg-[#2CA4BC]/10 hover:text-[#2CA4BC]"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "mr-3 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-[#2CA4BC]"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-3">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {firstname}
              </p>
              <p className="text-xs text-gray-600 truncate">{email}</p>
            </div>
          </div>

          {/* Notification Indicator */}
          <div
            onClick={() => setIsNotifOpen(true)}
            className="relative w-full flex items-center px-4 py-3 text-left rounded-lg bg-white"
          >
            {/* Bell Icon */}
            <div className="relative">
              <Bell size={20} className="mr-3 text-gray-500" />

              {/* 🔴 Unread count indicator */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 text-center font-semibold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            {/* Text */}
            <span className="font-medium">Notifications</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="mr-3 text-red-500 group-hover:text-red-700"
            />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        <NotificationModal
          open={isNotifOpen}
          onOpenChange={setIsNotifOpen}
          notifications={notifications}
          isLoading={notifLoading}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
    </>
  );
};

export default VendorSidebar;
