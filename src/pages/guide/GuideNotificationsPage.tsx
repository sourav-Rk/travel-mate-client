"use client";

import { GuideNotificationsList } from "@/components/guide/notifications/GuideNotificationsList";
import {
  useGuideNotificationsQuery,
  useMarkNotificationReadGuide,
  useMarkAllNotificationsReadGuide,
} from "@/hooks/guide/useGuideNotifications";
import toast from "react-hot-toast";
import type { ApiError } from "@/types/api/api";

export default function GuideNotificationsPage() {
  const { data, isLoading, error } = useGuideNotificationsQuery();
  const markReadMutation = useMarkNotificationReadGuide();
  const markAllReadMutation = useMarkAllNotificationsReadGuide();

  const notifications = data?.notifications || [];

  const handleMarkRead = (notificationId: string) => {
    markReadMutation.mutate(notificationId, {
      onSuccess: () => {
        toast.success("Notification marked as read");
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.response?.data?.message || "Failed to mark notification as read"
        );
      },
    });
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read");
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to mark all notifications as read"
        );
      },
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 md:ml-64 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Notifications
          </h2>
          <p className="text-sm text-red-700">
            {error instanceof Error ? error.message : "Failed to load notifications"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Stay updated with your latest notifications
          </p>
        </div>

        {/* Notifications List */}
        <GuideNotificationsList
          notifications={notifications}
          isLoading={isLoading || false}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
    </div>
  );
}

