import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import type { Participant } from "@/types/chat";

interface ChatComposerProps {
  onSend: (message: string) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

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

    onSend(trimmedMessage);
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
      // User is typing - emit start_typing
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
      // User cleared the input - emit stop_typing
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
          <button
            className="flex-shrink-0 p-2 sm:p-2.5 hover:bg-slate-100 rounded-full transition-colors duration-200 mb-1"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5 text-[#5aabba]" />
          </button>

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
            disabled={!message.trim()}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] hover:from-[#4a9aaa] hover:to-[#3a8a9a] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md disabled:shadow-none mb-1"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}