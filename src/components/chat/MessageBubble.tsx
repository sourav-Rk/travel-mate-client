import { format } from "date-fns";
import { useState } from "react";

interface MessageBubbleProps {
  message: {
    text: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read" | "failed";
    readAt?: string;
  };
  sender: {
    name: string;
    avatarUrl?: string;
  };
  isOwn: boolean;
  showAvatar: boolean;
  showName: boolean;
}

export default function MessageBubble({
  message,
  sender,
  isOwn,
  showAvatar,
  showName,
}: MessageBubbleProps) {
  const [avatarError, setAvatarError] = useState(false);

  
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const getInitial = (name: string): string => {
    if (!name || name.trim().length === 0) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getAvatarBackground = (isOwn: boolean) => {
    return isOwn 
      ? "bg-gradient-to-br from-[#5aabba] to-[#4a9aaa]"
      : "bg-gradient-to-br from-gray-400 to-gray-500";
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;

    const showFallback = !sender.avatarUrl || avatarError;
    
    if (showFallback) {
      return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarBackground(isOwn)}`}>
          {getInitial(sender.name)}
        </div>
      );
    }

    return (
      <img
        src={sender.avatarUrl}
        alt={sender.name}
        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
        onError={() => setAvatarError(true)}
      />
    );
  };

  if (isOwn) {
    return (
      <div className="flex items-end gap-2 justify-end group">
        <div className="flex flex-col items-end max-w-[70%]">
          <div className={`px-4 py-2 rounded-2xl rounded-br-md shadow-sm ${
            message.status === "failed" 
              ? "bg-red-100 text-red-800 border border-red-200" 
              : "bg-[#5aabba] text-white"
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          </div>
          <div className="flex items-center gap-1 mt-1 px-1">
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
        {renderAvatar()}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 group">
      {renderAvatar()}
      <div className="flex flex-col items-start max-w-[70%]">
        {showName && (
          <span className="text-xs text-gray-600 font-medium mb-1 ml-1">
            {sender.name}
          </span>
        )}
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}