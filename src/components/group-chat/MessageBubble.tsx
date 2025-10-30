"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { GroupMessage } from "@/types/group-chatType";

interface MessageBubbleProps {
  message: GroupMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  showSenderName?: boolean;
  previousMessage?: GroupMessage;
  nextMessage?: GroupMessage;
}

function formatMessageTime(date: Date): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return messageDate.toLocaleDateString();
}

function getSenderInitials(senderName: string, senderType: string): string {
  // This is a simple implementation - in a real app, you'd fetch the actual user name
  const typeInitial = senderName?.charAt(0).toUpperCase();
  const idInitial = senderName?.charAt(0).toUpperCase();
  return `${typeInitial}${idInitial}`;
}

// function getSenderDisplayName(senderId: string, senderType: string): string {
//   // This is a simple implementation - in a real app, you'd fetch the actual user name
//   return `${senderType.charAt(0).toUpperCase() + senderType.slice(1)} ${senderId.slice(-4)}`;
// }

function shouldShowAvatar(
  message: GroupMessage,
  previousMessage: GroupMessage | undefined,
  isOwn: boolean
): boolean {
  if (isOwn) return false;
  if (!previousMessage) return true;
  
  const timeDiff = new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime();
  const isDifferentSender = message.senderId !== previousMessage.senderId;
  const isMoreThan5Minutes = timeDiff > 5 * 60 * 1000; // 5 minutes
  
  return isDifferentSender || isMoreThan5Minutes;
}

function shouldShowSenderName(
  message: GroupMessage,
  previousMessage: GroupMessage | undefined,
  isOwn: boolean
): boolean {
  if (isOwn) return false;
  if (!previousMessage) return true;
  
  return message.senderId !== previousMessage.senderId;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = false,
  showSenderName = false,
  previousMessage,
  nextMessage,
}: MessageBubbleProps) {
  const shouldShowAvatarForThisMessage = shouldShowAvatar(message, previousMessage, isOwn);
  const shouldShowSenderNameForThisMessage = shouldShowSenderName(message, previousMessage, isOwn);
  
  const isConsecutive = previousMessage && 
    message.senderId === previousMessage.senderId && 
    new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000;

  return (
    <div className={cn(
      "flex gap-2 px-3 py-1 group",
      isOwn ? "flex-row-reverse" : "flex-row",
      isConsecutive && !isOwn ? "pt-0" : "pt-2"
    )}>
      {/* Avatar */}
      {shouldShowAvatarForThisMessage && !isOwn && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white">
              {getSenderInitials(message?.senderName, message?.senderType)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {/* Spacer for consecutive messages */}
      {!shouldShowAvatarForThisMessage && !isOwn && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message content */}
      <div className={cn(
        "flex flex-col max-w-[70%] sm:max-w-[60%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender name */}
        {shouldShowSenderNameForThisMessage && !isOwn && (
          <div className="text-xs text-gray-500 mb-1 px-1">
            {/* {getSenderDisplayName(message.senderId, message.senderType)}
             */}
             {message?.senderName}
          </div>
        )}

        {/* Message bubble */}
        <div className={cn(
          "relative px-3 py-2 rounded-2xl shadow-sm",
          isOwn 
            ? "bg-[#5aabba] text-white rounded-br-md" 
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md",
          isConsecutive && !isOwn ? "rounded-tl-sm" : ""
        )}>
          <p className="text-sm leading-relaxed break-words">
            {message.message}
          </p>
          
          {/* Message time */}
          <div className={cn(
            "text-xs mt-1",
            isOwn ? "text-white/70" : "text-gray-500"
          )}>
            {formatMessageTime(message?.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}





