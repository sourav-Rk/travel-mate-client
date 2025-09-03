"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Filter } from "lucide-react";
import { useState } from "react";
import type { INotificationEntity } from "@/types/notificationType";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: INotificationEntity[];
  isLoading?: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationModal({
  open,
  onOpenChange,
  notifications,
  isLoading,
  onMarkRead,
  onMarkAllRead,
}: NotificationModalProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("unread");

  const unread = notifications?.filter((n) => !n.isRead) ?? [];
  const displayNotifications =
    activeFilter === "unread" ? unread : notifications;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] p-0 bg-white rounded-2xl shadow-xl border-0 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Notifications
            </DialogTitle>
            <div className="flex items-center gap-2">
              {/* Filter Icon */}
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => onOpenChange(false)}
              ></Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant={activeFilter === "unread" ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
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
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
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
        </DialogHeader>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">
                Loading notifications...
              </div>
            </div>
          ) : displayNotifications?.length ? (
            <div className="divide-y divide-gray-100">
              {displayNotifications.map((notification, index) => (
                <div
                  key={
                    notification._id ||
                    `${notification.title}-${notification.createdAt}`
                  }
                  className={`px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 ${
                    !notification.isRead ? "bg-[#2CA4BC]/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm leading-relaxed">
                          {notification.title}
                        </h4>
                        {!notification.isRead && notification._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#2CA4BC] hover:text-[#2CA4BC]/80 hover:bg-[#2CA4BC]/10 rounded-full flex-shrink-0 ml-2"
                            onClick={() => onMarkRead(notification._id ?? "")}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {notification.message}
                      </p>
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
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {activeFilter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-xs text-gray-500 text-center">
                {activeFilter === "unread"
                  ? "All caught up! You have no unread notifications."
                  : "You have no notifications at the moment."}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Optional action area */}
        {displayNotifications?.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
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
      </DialogContent>
    </Dialog>
  );
}
