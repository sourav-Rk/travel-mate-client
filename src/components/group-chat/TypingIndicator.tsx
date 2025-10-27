"use client";

import { cn } from "@/lib/utils";
import type { TypingUser } from "@/types/group-chatType";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  className?: string;
}

function getTypingText(typingUsers: TypingUser[]): string {
  if (typingUsers.length === 0) return "";
  
  if (typingUsers.length === 1) {
    return `${typingUsers[0].userType.charAt(0).toUpperCase() + typingUsers[0].userType.slice(1)} is typing...`;
  }
  
  if (typingUsers.length === 2) {
    const [first, second] = typingUsers;
    return `${first.userType.charAt(0).toUpperCase() + first.userType.slice(1)} and ${second.userType.charAt(0).toUpperCase() + second.userType.slice(1)} are typing...`;
  }
  
  return `${typingUsers.length} people are typing...`;
}

export function TypingIndicator({ typingUsers, className }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 text-sm text-gray-500",
      className
    )}>
      {/* Typing animation */}
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
      
      {/* Typing text */}
      <span className="text-xs">
        {getTypingText(typingUsers)}
      </span>
    </div>
  );
}
