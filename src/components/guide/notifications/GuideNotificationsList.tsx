"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { INotificationEntity } from "@/types/notificationType";

interface GuideNotificationsListProps {
  notifications: INotificationEntity[];
  isLoading?: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function GuideNotificationsList({
  notifications,
  isLoading,
  onMarkRead,
  onMarkAllRead,
}: GuideNotificationsListProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("unread");

  const unread = notifications?.filter((n) => !n.isRead) ?? [];
  const displayNotifications =
    activeFilter === "unread" ? unread : notifications;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2CA4BC]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Notifications
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeFilter === "unread" ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeFilter === "unread"
                  ? "bg-[#2CA4BC] text-white hover:bg-[#2CA4BC]/90 shadow-sm"
                  : "bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => setActiveFilter("unread")}
            >
              Unread
            </Button>
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-[#2CA4BC] text-white hover:bg-[#2CA4BC]/90 shadow-sm"
                  : "bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            {/* Mark all as read button */}
            {activeFilter === "unread" && unread.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-xs text-[#2CA4BC] hover:text-[#2CA4BC]/80 hover:bg-[#2CA4BC]/10 rounded-lg px-3"
                onClick={onMarkAllRead}
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {displayNotifications?.length ? (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => (
              <div
                key={
                  notification._id ||
                  `${notification.title}-${notification.createdAt}`
                }
                className={`px-4 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 ${
                  !notification.isRead ? "bg-[#2CA4BC]/5" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-relaxed">
                        {notification.title}
                      </h4>
                      {!notification.isRead && notification._id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#2CA4BC] hover:text-[#2CA4BC]/80 hover:bg-[#2CA4BC]/10 rounded-full flex-shrink-0"
                          onClick={() => onMarkRead(notification._id ?? "")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {notification.message}
                    </p>

                    {notification.createdAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>

                  {/* Read Status Indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-[#2CA4BC] rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              {activeFilter === "unread"
                ? "No unread notifications"
                : "No notifications"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center max-w-md px-2">
              {activeFilter === "unread"
                ? "All caught up! You have no unread notifications."
                : "You have no notifications at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {displayNotifications?.length > 0 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {displayNotifications.length}{" "}
              {activeFilter === "unread" ? "unread" : "total"} notification
              {displayNotifications.length !== 1 ? "s" : ""}
            </span>
            {activeFilter === "all" && unread.length > 0 && (
              <span className="text-[#2CA4BC] font-medium">
                {unread.length} unread
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

