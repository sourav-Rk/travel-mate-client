"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GroupChatInputProps {
  onSendMessage: (message: string) => void;
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
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Handle typing indicators
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    } else if (!value.trim() && isTyping) {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage("");
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleFocus = () => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    }
  };

  const handleBlur = () => {
    if (isTyping) {
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
    };
  }, []);

  return (
    <div className={cn(
      "flex items-end gap-2 p-3 sm:p-4 bg-white border-t border-gray-200",
      className
    )}>
      {/* Message input */}
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[40px] max-h-[120px] resize-none pr-12",
            "border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#5aabba] focus:border-[#5aabba]",
            "text-sm leading-relaxed"
          )}
          rows={1}
        />
        
        {/* Character count (optional) */}
        {message.length > 0 && (
          <div className="absolute bottom-1 right-12 text-xs text-gray-400">
            {message.length}/1000
          </div>
        )}
      </div>

      {/* Send button */}
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled}
        size="sm"
        className={cn(
          "h-10 w-10 rounded-full p-0 flex-shrink-0",
          "bg-[#5aabba] hover:bg-[#4a9aaa] text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200"
        )}
        aria-label="Send message"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </Button>
    </div>
  );
}

