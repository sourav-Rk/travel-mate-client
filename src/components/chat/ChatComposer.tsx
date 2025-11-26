import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, Image as ImageIcon, Video, File, Mic, Loader2 } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import type { Participant, MediaAttachment } from "@/types/chat";
import { uploadChatMedia } from "@/services/chat/media.service";
import { getMediaType, formatFileSize } from "@/utils/mediaUtils";

interface ChatComposerProps {
  onSend: (message: string, mediaAttachments?: MediaAttachment[]) => void;
  className?: string;
  chatRoomId : string;
  self : Participant
}

export default function ChatComposer({
  onSend,
  className = "",
  chatRoomId,
  self 

}: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {socket} = useSocket();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

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
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    const hasFiles = selectedFiles.length > 0;

    if (!trimmedMessage && !hasFiles) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (socket) {
      socket.emit("stop_typing", {
        chatRoomId,
        userId: self.id,
      });
    }

    let mediaAttachments: MediaAttachment[] | undefined;

    // Upload files if any
    if (hasFiles) {
      setUploading(true);
      try {
        mediaAttachments = await uploadChatMedia(selectedFiles, self.type);
        setSelectedFiles([]);
      } catch (error: any) {
        console.error("Error uploading media:", error);
        alert(error?.message || "Failed to upload files");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSend(trimmedMessage || "", mediaAttachments);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    if(!socket) return;

     if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }


     if (value.trim().length > 0) {
      socket.emit("start_typing", {
        chatRoomId,
        userId: self.id,
      });

      // Set timeout to emit stop_typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", {
          chatRoomId,
          userId: self.id,
        });
      }, 2000);
    } else {

      socket.emit("stop_typing", {
        chatRoomId,
        userId: self.id,
      });
    }
  };

    useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Emit stop typing when component unmounts
      if (socket) {
        socket.emit("stop_typing", {
          chatRoomId,
          userId: self.id,
        });
      }
    };
  }, [socket, chatRoomId, self.id]);



  return (
    <div className={`bg-white border-t border-slate-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg ${className}`}>
      <div className="max-w-4xl mx-auto">
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
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="flex-shrink-0 p-2 sm:p-2.5 hover:bg-slate-100 rounded-full transition-colors duration-200 mb-1 cursor-pointer"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5 text-[#5aabba]" />
          </label>

          {/* Message Input Container */}
          <div className="flex-1 relative bg-[#f5f7fa] border border-slate-200 rounded-2xl hover:border-[#5aabba]/50 focus-within:border-[#5aabba] focus-within:ring-2 focus-within:ring-[#5aabba]/20 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-[#333333] placeholder:text-gray-400 focus:outline-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />

            {/* Emoji Button */}
            <button
              className="absolute right-3 bottom-3 p-1 hover:bg-slate-200 rounded-full transition-colors duration-200"
              aria-label="Add emoji"
            >
              <Smile className="h-5 w-5 text-gray-400 hover:text-[#5aabba]" />
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!message.trim() && selectedFiles.length === 0) || uploading}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] hover:from-[#4a9aaa] hover:to-[#3a8a9a] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md disabled:shadow-none mb-1"
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
              const Icon = mediaType === "image" ? ImageIcon : mediaType === "video" ? Video : mediaType === "voice" ? Mic : File;
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
                    onClick={() => {
                      removeFile(index);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Text */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}