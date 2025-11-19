import type { GuideChatMessage } from "@/types/guide-chat";
import { cn } from "@/lib/utils";
import { Image, File, Mic, Download } from "lucide-react";
import { useState } from "react";
import { QuoteMessageBubble } from "./QuoteMessageBubble";
import type { QuoteMessagePayload } from "@/types/local-guide-booking";

interface GuideChatMessageBubbleProps {
  message: GuideChatMessage;
  isOwn: boolean;
  isTraveller?: boolean;
  onAcceptQuote?: (quoteId: string) => void;
  onDeclineQuote?: (quoteId: string) => void;
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function GuideChatMessageBubble({
  message,
  isOwn,
  isTraveller = false,
  onAcceptQuote,
  onDeclineQuote,
}: GuideChatMessageBubbleProps) {
  const [imageError, setImageError] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (message.messageType === "system") {
    return (
      <div className="flex justify-center my-3">
        <div className="text-xs text-slate-500 bg-white/60 px-3 py-1 rounded-full shadow-sm">
          {message.message ?? "System update"}
        </div>
      </div>
    );
  }

  if (message.messageType === "quote" && message.metadata) {
    const quotePayload = message.metadata as unknown as  QuoteMessagePayload;
    return (
      <QuoteMessageBubble
        quote={quotePayload}
        isOwn={isOwn}
        isTraveller={isTraveller}
        onAccept={onAcceptQuote}
        onDecline={onDeclineQuote}
      />
    );
  }

  const hasMedia = message.mediaAttachments && message.mediaAttachments.length > 0;
  const hasText = message.message && message.message.trim().length > 0 && message.message !== "[attachment]";

  return (
    <div className={cn("flex w-full mb-3", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm text-sm",
          isOwn
            ? "bg-[#d4b59e] text-slate-900 rounded-br-sm"
            : "bg-white/90 text-slate-800 rounded-bl-sm"
        )}
      >
        {hasText && <p className="whitespace-pre-wrap mb-2">{message.message}</p>}
        
       {hasMedia && (
          <div className={cn("space-y-2", hasText && "mt-2")}>
            {message.mediaAttachments!.map((attachment, index) => (
              <div key={attachment.publicId || index} className="rounded-lg overflow-hidden">
                {attachment.type === "image" ? (
                  <div className="relative">
                    {!imageError ? (
                      <img
                        src={attachment.url}
                        alt={attachment.fileName || "Image"}
                        className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[400px] object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onError={() => setImageError(true)}
                        onClick={() => setExpandedImage(attachment.url)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-100 flex items-center justify-center rounded-lg">
                        <Image className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                ) : attachment.type === "video" ? (
                  <div className="relative">
                    <video
                      src={attachment.url}
                      controls
                      className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[400px] rounded-lg"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    {attachment.fileName && (
                      <p className="text-xs text-slate-600 mt-1 truncate">{attachment.fileName}</p>
                    )}
                  </div>
                ) : attachment.type === "voice" ? (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C6A3B] flex-shrink-0" />
                    <audio src={attachment.url} controls className="flex-1 min-w-0 h-8">
                      Your browser does not support the audio tag.
                    </audio>
                    {attachment.duration && (
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {Math.floor(attachment.duration / 60)}:
                        {String(Math.floor(attachment.duration % 60)).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                ) : (
                  <a
                    href={attachment.url}
                    download={attachment.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <File className="w-4 h-4 sm:w-5 sm:h-5 text-[#8C6A3B] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{attachment.fileName || "File"}</p>
                      {attachment.fileSize && (
                        <p className="text-xs text-slate-500">{formatFileSize(attachment.fileSize)}</p>
                      )}
                    </div>
                    <Download className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-1 text-[11px] text-slate-500 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Expanded"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

