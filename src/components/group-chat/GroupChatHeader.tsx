"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GroupChatDo } from "@/types/group-chatType";

interface GroupChatHeaderProps {
  groupChat: GroupChatDo | null;
  onlineMembers: string[];
  onBack?: () => void;
  onOpenDetails?: () => void;
  showBackButton?: boolean;
  className?: string;
}

function getGroupInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase() || "GC";
}

function getMemberCountText(members: GroupChatDo["members"]): string {
  const count = members.length;
  if (count === 0) return "No members";
  if (count === 1) return "1 member";
  return `${count} members`;
}

function getOnlineStatusText(onlineMembers: string[], totalMembers: number): string {
  const onlineCount = onlineMembers.length;
  if (onlineCount === 0) return "No one online";
  if (onlineCount === 1) return "1 online";
  return `${onlineCount} online`;
}

export function GroupChatHeader({
  groupChat,
  onlineMembers,
  onBack,
  onOpenDetails,
  showBackButton = false,
  className,
}: GroupChatHeaderProps) {
  if (!groupChat) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 sm:p-4 bg-white border-b border-gray-200",
        className
      )}>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const memberCount = getMemberCountText(groupChat.members);
  const onlineStatus = getOnlineStatusText(onlineMembers, groupChat.members.length);

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 sm:p-4 bg-white border-b border-gray-200",
      className
    )}>
      {/* Back button (mobile) */}
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden p-2 hover:bg-gray-100"
          aria-label="Go back"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </Button>
      )}

      {/* Group avatar */}
      <div className="relative">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarFallback className="font-medium bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white">
            {getGroupInitials(groupChat.name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Online indicator */}
        {onlineMembers.length > 0 && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>

      {/* Group info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            {groupChat.name}
          </h2>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{memberCount}</span>
          <span>•</span>
          <span>{onlineStatus}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {/* Info button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenDetails}
          className="p-2 hover:bg-gray-100"
          aria-label="Group info"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </Button>

        {/* More options button */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100"
          aria-label="More options"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
