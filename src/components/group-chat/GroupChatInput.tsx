"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, X, Image as ImageIcon, Video, File, Mic, Loader2, Send } from "lucide-react";
import type { MediaAttachment } from "@/types/group-chatType";
import { uploadChatMedia } from "@/services/chat/media.service";
import { getMediaType, formatFileSize } from "@/utils/mediaUtils";
import toast from "react-hot-toast";

interface GroupChatInputProps {
  onSendMessage: (message: string, mediaAttachments?: MediaAttachment[]) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function GroupChatInput({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Type a message...",
  className,
}: GroupChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine user role for media upload
  const userRole = "client"; // Group chat is primarily for clients, but can be extended

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Handle typing indicators
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    } else if (!value.trim() && !isTyping && selectedFiles.length === 0) {
      setIsTyping(false);
      onStopTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds of no input
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onStopTyping();
      }, 2000);
    }
  };

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
      // Clean up object URLs for images
      if (prev[index] && getMediaType(prev[index].type) === "image") {
        URL.revokeObjectURL(URL.createObjectURL(prev[index]));
      }
      return newFiles;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    const hasFiles = selectedFiles.length > 0;

    if ((!trimmedMessage && !hasFiles) || disabled) return;

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    let mediaAttachments: MediaAttachment[] | undefined;

    // Upload files if any
    if (hasFiles) {
      setUploading(true);
      try {
        mediaAttachments = await uploadChatMedia(selectedFiles, userRole);
        setSelectedFiles([]);
      } catch (error: any) {
        console.error("Error uploading media:", error);
        toast.error(error.message || "Failed to upload files");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSendMessage(trimmedMessage || "", mediaAttachments);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFocus = () => {
    if ((message.trim() || selectedFiles.length > 0) && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    }
  };

  const handleBlur = () => {
    if (isTyping && !message.trim() && selectedFiles.length === 0) {
      setIsTyping(false);
      onStopTyping();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Clean up object URLs
      selectedFiles.forEach((file) => {
        if (getMediaType(file.type) === "image") {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, []);

  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 sm:p-4 bg-white border-t border-gray-200",
      className
    )}>
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
            const previewUrl = mediaType === "image" ? URL.createObjectURL(file) : undefined;

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
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                    <Icon className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
          onChange={handleFileSelect}
          className="hidden"
          id="group-file-input"
        />
        <label
          htmlFor="group-file-input"
          className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 cursor-pointer"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5 text-[#5aabba]" />
        </label>

        {/* Message Input Container */}
        <div className="flex-1 relative bg-[#f5f7fa] border border-slate-200 rounded-2xl hover:border-[#5aabba]/50 focus-within:border-[#5aabba] focus-within:ring-2 focus-within:ring-[#5aabba]/20 transition-all duration-200">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled || uploading}
            className={cn(
              "w-full resize-none bg-transparent px-4 py-3 text-sm text-[#333333] placeholder:text-gray-400 focus:outline-none",
              "min-h-[44px] max-h-[120px]"
            )}
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!message.trim() && selectedFiles.length === 0) || disabled || uploading}
          size="sm"
          className={cn(
            "h-10 w-10 rounded-full p-0 flex-shrink-0",
            "bg-[#5aabba] hover:bg-[#4a9aaa] text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          aria-label="Send message"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-[10px] sm:text-xs text-gray-500 text-center">
        Press Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
}
