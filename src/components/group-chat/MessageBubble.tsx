"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { GroupMessage, MediaAttachment } from "@/types/group-chatType";
import { Image as ImageIcon, Video, File, Mic, Play, Download, X } from "lucide-react";
import { formatFileSize } from "@/utils/mediaUtils";

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

function getSenderInitials(senderName: string): string {
  const typeInitial = senderName?.charAt(0).toUpperCase();
  const idInitial = senderName?.charAt(0).toUpperCase();
  return `${typeInitial}${idInitial}`;
}

// Helper functions for message grouping and alignment
const isFromSameSender = (current: GroupMessage, prev?: GroupMessage): boolean => {
  if (!prev) return false;
  return String(current.senderId) === String(prev.senderId);
};

const shouldGroupWithPrevious = (message: GroupMessage, prev?: GroupMessage): boolean => {
  if (!prev) return false;
  const timeDiff = new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime();
  return isFromSameSender(message, prev) && timeDiff < 5 * 60 * 1000; // within 5 mins
};

export function MessageBubble({
  message,
  isOwn,
  previousMessage,
  nextMessage,
}: MessageBubbleProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Determine if this message should be grouped with the previous one
  const isGrouped = shouldGroupWithPrevious(message, previousMessage);
  
  // Show avatar only for other users' messages, and only if not grouped
  const shouldShowAvatar = !isOwn && !isGrouped;
  
  // Show sender name only for other users' messages, and only if not grouped
  const shouldShowName = !isOwn && !isGrouped;

  const renderMedia = (attachment: MediaAttachment, index: number) => {
    // Validate attachment has required fields
    if (!attachment || !attachment.url || !attachment.type) {
      console.warn("Invalid media attachment:", attachment);
      return null;
    }
    
    const key = `${attachment.publicId || attachment.url}-${index}`;

    switch (attachment.type) {
      case "image":
        return (
          <div key={key} className="mb-2 last:mb-0">
            <div className="relative group">
              {imageError[key] ? (
                <div className="w-full max-w-sm h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
                <img
                  src={attachment.url}
                  alt={attachment.fileName || "Image"}
                  className="max-w-sm max-h-96 rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
                  onClick={() => setExpandedImage(attachment.url)}
                  onError={() => setImageError((prev) => ({ ...prev, [key]: true }))}
                />
              )}
            </div>
          </div>
        );

      case "video":
        return (
          <div key={key} className="mb-2 last:mb-0">
            <div className="relative group max-w-sm">
              {attachment.thumbnailUrl ? (
                <div className="relative">
                  <img
                    src={attachment.thumbnailUrl}
                    alt={attachment.fileName || "Video"}
                    className="w-full max-h-96 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  {attachment.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-sm h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                download={attachment.fileName}
              />
            </div>
            {attachment.fileName && (
              <p className="text-xs text-gray-600 mt-1 truncate">{attachment.fileName}</p>
            )}
          </div>
        );

      case "voice":
        return (
          <div key={key} className="mb-2 last:mb-0">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 max-w-sm">
              <div className="w-10 h-10 bg-[#5aabba] rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Voice Message</p>
                {attachment.duration && (
                  <p className="text-xs text-gray-500">
                    {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>
              <audio controls className="flex-1 max-w-xs">
                <source src={attachment.url} type={attachment.mimeType || "audio/mpeg"} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );

      case "file":
        return (
          <div key={key} className="mb-2 last:mb-0">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              download={attachment.fileName}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 max-w-sm transition-colors"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {attachment.fileName || "File"}
                </p>
                {attachment.fileSize && (
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                )}
              </div>
              <Download className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </a>
          </div>
        );

      default:
        return null;
    }
  };


  const isLastInGroup = !nextMessage || 
    !isFromSameSender(message, nextMessage) ||
    (new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime()) >= 5 * 60 * 1000;

  const getBubbleRoundedClasses = () => {
    const baseRounded = "rounded-2xl";
    
    if (isOwn) {
      if (isGrouped && !isLastInGroup) {
        return `${baseRounded} rounded-br-sm`;
      } else if (isGrouped && isLastInGroup) {
        return baseRounded;
      } else {
        return baseRounded;
      }
    } else {
      if (isGrouped && !isLastInGroup) {
        return `${baseRounded} rounded-bl-sm`;
      } else if (isGrouped && isLastInGroup) {
        return baseRounded;
      } else {
        return baseRounded;
      }
    }
  };

  return (
    <>
      {/* Outer container: Controls horizontal alignment of entire message */}
      <div className={cn(
        "w-full flex",
        isOwn ? "justify-end" : "justify-start"
      )}>
        {/* Inner container: Holds avatar (for others) and message content */}
        <div className={cn(
          "flex gap-2 px-3 py-1 group",
          isOwn ? "flex-row-reverse" : "flex-row",
          isGrouped ? "pt-0" : "pt-2",
          // Constrain width but allow content to determine size
          "max-w-[85%] sm:max-w-[75%]"
        )}>
          {/* Avatar - Only shown for other users and when not grouped */}
          {shouldShowAvatar && (
            <div className="flex-shrink-0 self-end">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] text-white">
                  {getSenderInitials(message?.senderName || "?")}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Spacer for grouped messages from other users (maintains alignment with avatar width) */}
          {!shouldShowAvatar && !isOwn && (
            <div className="w-8 flex-shrink-0" />
          )}

          {/* Message content container - Contains name, media, and bubble */}
          <div className={cn(
            "flex flex-col min-w-0",
            isOwn ? "items-end" : "items-start"
          )}>
            {/* Sender name - Only shown for other users and when not grouped */}
            {shouldShowName && (
              <div className="text-xs text-gray-500 mb-1 px-1">
                {message?.senderName || "Unknown"}
              </div>
            )}

            {/* Media Attachments */}
            {message.mediaAttachments && message.mediaAttachments.length > 0 && (
              <div className={cn(
                "mb-2 w-full",
                isOwn ? "flex flex-col items-end" : "flex flex-col items-start"
              )}>
                {message.mediaAttachments.map((attachment, index) => renderMedia(attachment, index))}
              </div>
            )}

            {/* Message bubble */}
            {message.message && (
              <div className={cn(
                "relative px-3 py-2 shadow-sm",
                isOwn 
                  ? "bg-[#5aabba] text-white" 
                  : "bg-white border border-gray-200 text-gray-900",
                getBubbleRoundedClasses()
              )}>
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
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
            )}

            {/* Time for media-only messages */}
            {(!message.message || message.message.trim().length === 0) && 
             message.mediaAttachments && 
             message.mediaAttachments.length > 0 && (
              <div className={cn(
                "text-xs mt-1 px-1",
                isOwn ? "text-gray-500" : "text-gray-500"
              )}>
                {formatMessageTime(message?.createdAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={expandedImage}
              alt="Expanded"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}