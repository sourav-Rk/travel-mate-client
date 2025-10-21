import { Phone, Video, MoreVertical } from "lucide-react";
import type { Participant } from "@/types/chat";
import { useOnlineStatus } from "@/hooks/chat/useOnlineStatus";

interface ChatHeaderProps {
  other: Participant;
  className?: string;
}

export default function ChatHeader({ other, className = "" }: ChatHeaderProps) {
  const {isOnline} = useOnlineStatus(other.id);
  
  const getInitials = (name: string): string => {
    if(!name) return "?"
    return name
      .split("")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className={`flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4 shadow-sm ${className}`}>
      {/* User Info Section */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* Avatar with Online Status */}
        <div className="relative flex-shrink-0">
          {other.avatarUrl ? (
            <img
              src={other.avatarUrl}
              alt={`${other.name}'s avatar`}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#5aabba]/20"
            />
          ) : (
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-md">
              {getInitials(other.name)}
            </div>
          )}
          {/* Online Status Indicator */}
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-white shadow-sm ${
              isOnline ? "bg-emerald-500" : "bg-gray-400"
            }`}
            aria-label={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* Name and Status */}
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-semibold text-[#333333] truncate">
            {other.name}
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${
            isOnline ? "text-emerald-600" : "text-gray-500"
          }`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          className="p-2 hover:bg-[#5aabba]/10 rounded-full transition-colors duration-200"
          aria-label="Voice call"
        >
          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#5aabba]" />
        </button>
        <button
          className="p-2 hover:bg-[#5aabba]/10 rounded-full transition-colors duration-200"
          aria-label="Video call"
        >
          <Video className="h-4 w-4 sm:h-5 sm:w-5 text-[#5aabba]" />
        </button>
        <button
          className="p-2 hover:bg-[#5aabba]/10 rounded-full transition-colors duration-200"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-[#5aabba]" />
        </button>
      </div>
    </div>
  );
}