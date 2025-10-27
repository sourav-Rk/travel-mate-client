"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { GroupChatDo } from "@/types/group-chatType";


function getGroupInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase() || "GC";
}

function formatTimeAgo(date?: Date) {
  if (!date) return "";
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  return `${day}d`;
}

function getMemberCountText(members:GroupChatDo["members"]) {
  const count = members.length;
  if (count === 0) return "No members";
  if (count === 1) return "1 member";
  return `${count} members`;
}

export function GroupChatListItem({
  group,
  active,
  onClick,
}: {
  group: GroupChatDo;
  active?: boolean;
  onClick?: () => void;
}) {
  const initials = getGroupInitials(group.name);
  const memberCount = getMemberCountText(group.members);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md p-3 text-left transition-colors",
        active
          ? "bg-[#5aabba]/10 text-[#333333]"
          : "hover:bg-gray-50",
      )}
      aria-label={`Open group chat ${group.name}`}
    >
      <div className="flex items-center gap-3">
        {/* Group Avatar */}
        <div className="relative">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarFallback className="font-medium bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Member count badge */}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border-2 border-white flex items-center justify-center">
            <svg 
              className="w-3 h-3 text-gray-600" 
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
          </div>
        </div>

        {/* Group Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              "truncate font-semibold text-sm sm:text-base", 
              active ? "text-[#333333]" : "text-[#333333]"
            )}>
              {group.name}
            </p>
            <span className={cn(
              "shrink-0 text-xs", 
              active ? "text-gray-600" : "text-gray-500"
            )}>
              {formatTimeAgo(group.lastMessageAt)}
            </span>
          </div>
          
          {/* Last Message */}
          {group.lastMessage && (
            <p className={cn(
              "truncate text-sm mt-0.5", 
              active ? "text-gray-600" : "text-gray-500"
            )}>
              {group.lastMessage}
            </p>
          )}
          
          {/* Member Count */}
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-xs font-medium",
              active ? "text-[#5aabba]" : "text-gray-500"
            )}>
              {memberCount}
            </span>
            
            {/* Package ID badge */}
            {/* <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full truncate max-w-[120px]">
              {group.packageId}
            </span> */}
          </div>
        </div>
      </div>
    </button>
  );
}