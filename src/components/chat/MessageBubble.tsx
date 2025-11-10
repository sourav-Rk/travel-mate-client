import { format } from "date-fns";
import { useState } from "react";
import { Image as ImageIcon, Video, File, Mic, Play, Download, X } from "lucide-react";
import type { MediaAttachment } from "@/types/chat";
import { formatFileSize } from "@/utils/mediaUtils";

interface MessageBubbleProps {
  message: {
    text: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read" | "failed";
    readAt?: string;
    mediaAttachments?: MediaAttachment[];
    messageType?: "text" | "media" | "mixed";
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

  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

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

  if (isOwn) {
    return (
      <>
        <div className="flex items-end gap-2 justify-end group">
          <div className="flex flex-col items-end max-w-[70%]">
            {/* Media Attachments */}
            {message.mediaAttachments && message.mediaAttachments.length > 0 && (
              <div className="mb-2 w-full">
                {message.mediaAttachments.map((attachment, index) => renderMedia(attachment, index))}
              </div>
            )}
            
            {/* Text Message */}
            {message.text && (
              <div className={`px-4 py-2 rounded-2xl rounded-br-md shadow-sm ${
                message.status === "failed" 
                  ? "bg-red-100 text-red-800 border border-red-200" 
                  : "bg-[#5aabba] text-white"
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              </div>
            )}
            
            <div className="flex items-center gap-1 mt-1 px-1">
              <span className="text-xs text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
          {renderAvatar()}
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

  return (
    <>
      <div className="flex items-end gap-2 group">
        {renderAvatar()}
        <div className="flex flex-col items-start max-w-[70%]">
          {showName && (
            <span className="text-xs text-gray-600 font-medium mb-1 ml-1">
              {sender.name}
            </span>
          )}
          
          {/* Media Attachments */}
          {message.mediaAttachments && message.mediaAttachments.length > 0 && (
            <div className="mb-2 w-full">
              {message.mediaAttachments.map((attachment, index) => renderMedia(attachment, index))}
            </div>
          )}
          
          {/* Text Message */}
          {message.text && (
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {message.text}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-1 mt-1 px-1">
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
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