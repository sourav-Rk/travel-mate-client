// interface MessageBubbleProps {
//   message: {
//     text: string;
//     timestamp: string;
//   };
//   sender: {
//     name: string;
//     avatarUrl?: string;
//   };
//   isOwn: boolean;
//   showAvatar?: boolean;
//   showName?: boolean;
// }

// export default function MessageBubble({
//   message,
//   sender,
//   isOwn,
//   showAvatar = true,
//   showName = false,
// }: MessageBubbleProps) {
//   const getInitials = (name: string): string => {
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();
//   };

//   const formatTime = (timestamp: string): string => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

//     if (diffInHours < 24) {
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } else if (diffInHours < 48) {
//       return "Yesterday " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } else {
//       return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + 
//              date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     }
//   };

//   return (
//     <div
//       className={`flex items-end gap-2 sm:gap-3 animate-fadeIn ${
//         isOwn ? "flex-row-reverse" : "flex-row"
//       }`}
//     >
//       {/* Avatar */}
//       {showAvatar ? (
//         <div className="flex-shrink-0">
//           {sender.avatarUrl ? (
//             <img
//               src={sender.avatarUrl}
//               alt={`${sender.name}'s avatar`}
//               className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-slate-200"
//             />
//           ) : (
//             <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
//               {getInitials(sender.name)}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"></div>
//       )}

//       {/* Message Content */}
//       <div
//         className={`flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[55%] ${
//           isOwn ? "items-end" : "items-start"
//         }`}
//       >
//         {/* Sender Name (for received messages) */}
//         {showName && !isOwn && (
//           <span className="text-xs font-medium text-[#333333] mb-1 px-1">
//             {sender.name}
//           </span>
//         )}

//         {/* Message Bubble */}
//         <div
//           className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${
//             isOwn
//               ? "bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white rounded-br-md"
//               : "bg-white text-[#333333] rounded-bl-md border border-slate-200"
//           }`}
//         >
//           <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap">
//             {message.text}
//           </p>
//         </div>

//         {/* Timestamp */}
//         <span
//           className={`text-[10px] sm:text-xs mt-1 px-1 ${
//             isOwn ? "text-[#5aabba]" : "text-gray-500"
//           }`}
//         >
//           {formatTime(message.timestamp)}
//         </span>
//       </div>
//     </div>
//   );
// }



import { format } from "date-fns";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
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

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (message.status) {
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return message.readAt ? `Read at ${format(new Date(message.readAt), "HH:mm")}` : "Read";
      case "failed":
        return "Failed to send";
      default:
        return "Sent";
    }
  };

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
            {getStatusIcon()}
          </div>
          {message.status === "failed" && (
            <span className="text-xs text-red-500 mt-1">
              {getStatusText()}
            </span>
          )}
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