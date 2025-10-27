"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { GroupChatDetailsDto, MemberDetailDto } from "@/types/group-chatType";

interface GroupDetailsViewProps {
  groupDetails: GroupChatDetailsDto | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  isLoading : boolean;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatDate(date?: Date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRoleBadgeColor(userType: MemberDetailDto["userType"]) {
  switch (userType) {
    case "client":
      return 
    case "guide":
      return "bg-purple-100 text-purple-700";
    case "vendor":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function GroupDetailsView({
  groupDetails,
  isOpen,
  onClose,
  className,
}: GroupDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<"members" | "info">("members");

  if (!groupDetails) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-details-title"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#5aabba] to-[#4a9aaa]">
          <div className="flex items-center justify-between">
            <h2
              id="group-details-title"
              className="text-lg font-semibold text-white"
            >
              Group Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close group details"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Group Avatar and Name */}
        <div className="flex-shrink-0 px-6 py-6 bg-gradient-to-b from-[#5aabba]/5 to-transparent border-b border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white">
                  {getInitials(groupDetails.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white shadow-md flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#5aabba]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#333333] mb-1">
              {groupDetails.name}
            </h3>
            <p className="text-sm text-gray-500">
              {groupDetails.membersCount}{" "}
              {groupDetails.membersCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              onClick={() => setActiveTab("members")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "members"
                  ? "text-[#5aabba]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Members
              {activeTab === "members" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5aabba]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "info"
                  ? "text-[#5aabba]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Info
              {activeTab === "info" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5aabba]" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "members" ? (
            <div className="px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  All Members ({groupDetails.membersCount})
                </h4>
              </div>
              <ul className="space-y-2">
                {groupDetails.memberDetails.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-[#5aabba]/20 to-[#4a9aaa]/20 text-[#5aabba]">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#333333] truncate">
                        {member.name}
                      </p>
                      <span
                        className={cn(
                          "inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                          getRoleBadgeColor(member.userType)
                        )}
                      >
                        {member.userType !== "client" ? member.userType:""}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Group Name */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Group Name
                  </label>
                  <p className="mt-1 text-sm font-medium text-[#333333]">
                    {groupDetails.name}
                  </p>
                </div>

                {/* Package ID */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Package ID
                  </label>
                  <p className="mt-1 text-sm font-medium text-[#333333] break-all">
                    {groupDetails.packageId}
                  </p>
                </div>

                {/* Created Date */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created On
                  </label>
                  <p className="mt-1 text-sm font-medium text-[#333333]">
                    {formatDate(groupDetails.createdAt)}
                  </p>
                </div>

                {/* Group ID */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Group ID
                  </label>
                  <p className="mt-1 text-sm font-mono  text-gray-600 break-all">
                    {groupDetails._id}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-[#5aabba]/10 to-[#4a9aaa]/10 rounded-lg border border-[#5aabba]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-[#5aabba]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <label className="text-xs font-semibold text-gray-600">
                        Members
                      </label>
                    </div>
                    <p className="text-2xl font-bold text-[#5aabba]">
                      {groupDetails.membersCount}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <label className="text-xs font-semibold text-gray-600">
                        Days Active
                      </label>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.floor(
                        (Date.now() - new Date(groupDetails.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}