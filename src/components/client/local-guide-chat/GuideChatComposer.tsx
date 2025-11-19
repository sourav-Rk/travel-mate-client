import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Video,
  File,
  Mic,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadGuideChatMedia } from "@/services/local-guide-chat/media.service";
import type { GuideChatMediaAttachment } from "@/types/guide-chat";
import { getMediaType, formatFileSize } from "@/utils/mediaUtils";
import { QuoteBuilder } from "./QuoteBuilder";

interface GuideChatComposerProps {
  disabled?: boolean;
  onSend: (message: string, attachments?: GuideChatMediaAttachment[]) => void;
  quickActions?: string[];
  guideChatRoomId?: string;
  isGuide?: boolean;
}

export function GuideChatComposer({
  disabled = false,
  onSend,
  quickActions = [],
  guideChatRoomId,
  isGuide = false,
}: GuideChatComposerProps) {
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      const mediaType = getMediaType(file.type);
      let maxSize = 50 * 1024 * 1024; // 50MB default
      if (mediaType === "image") maxSize = 10 * 1024 * 1024; // 10MB
      if (mediaType === "voice") maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        alert(`${file.name} exceeds ${formatFileSize(maxSize)} limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URLs for removed image files
      if (prev[index] && getMediaType(prev[index].type) === "image") {
        // URL will be revoked when component unmounts or file is removed
      }
      return newFiles;
    });
  };

  const handleSend = async () => {
    const trimmedMessage = value.trim();
    const hasFiles = selectedFiles.length > 0;

    if (!trimmedMessage && !hasFiles) return;

    let mediaAttachments: GuideChatMediaAttachment[] | undefined;

    // Upload files if any
    if (hasFiles) {
      setUploading(true);
      try {
        mediaAttachments = await uploadGuideChatMedia(selectedFiles);
        setSelectedFiles([]);
      } catch (error: unknown) {
        console.error("Error uploading media:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload files";
        alert(errorMessage);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSend(trimmedMessage || "", mediaAttachments);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {showQuoteBuilder && guideChatRoomId && (
        <QuoteBuilder
          guideChatRoomId={guideChatRoomId}
          onClose={() => setShowQuoteBuilder(false)}
          onSuccess={() => {
            setShowQuoteBuilder(false);
          }}
        />
      )}
      <div className="border-t border-slate-200/60 bg-white/70 p-4 space-y-3">
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => onSend(action)}
                className="rounded-full border border-[#E3D5C5] px-3 py-1 text-xs text-[#8C6A3B] hover:bg-[#F5F1E8]/60 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Create Quote Button (Only for guides) */}
        {isGuide && guideChatRoomId && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuoteBuilder(true)}
              disabled={disabled || uploading}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                disabled || uploading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] text-white hover:from-[#b08256] hover:to-[#7a5a2b]"
              )}
            >
              <FileText className="w-4 h-4" />
              Create Quote
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Attachment Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={handleFileSelect}
            className="hidden"
            id="guide-chat-file-input"
            disabled={disabled || uploading}
          />
          <label
            htmlFor="guide-chat-file-input"
            className={cn(
              "flex-shrink-0 p-2 sm:p-2.5 hover:bg-[#F5F1E8]/60 rounded-full transition-colors duration-200 mb-1 cursor-pointer",
              (disabled || uploading) && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5 text-[#8C6A3B]" />
          </label>

          {/* Message Input Container */}
          <div className="flex-1 relative bg-[#F5F1E8]/50 border border-slate-200 rounded-2xl hover:border-[#C49A6C]/50 focus-within:border-[#C49A6C] focus-within:ring-2 focus-within:ring-[#C49A6C]/20 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              disabled={disabled}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={
              (!value.trim() && selectedFiles.length === 0) ||
              uploading ||
              disabled
            }
            className={cn(
              "flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] hover:from-[#b08256] hover:to-[#7a5a2b] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md disabled:shadow-none mb-1"
            )}
            aria-label="Send message"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => {
              const mediaType = getMediaType(file.type);
              const Icon =
                mediaType === "image"
                  ? ImageIcon
                  : mediaType === "video"
                  ? Video
                  : mediaType === "voice"
                  ? Mic
                  : File;
              const previewUrl =
                mediaType === "image" ? URL.createObjectURL(file) : undefined;

              return (
                <div
                  key={index}
                  className="relative group bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                      onLoad={() => {
                        // Clean up will happen when file is removed
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      removeFile(index);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Text */}
        <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </>
  );
}
