"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { GroupMessage } from "@/types/group-chatType";

interface GroupChatWindowProps {
  messages: GroupMessage[];
  typingUsers: { userId: string; userType: "client" | "guide" | "vendor"; timestamp: Date }[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement|null>;
  onLoadMore?: () => void;
  className?: string;
}

export function GroupChatWindow({
  messages,
  typingUsers,
  isLoading,
  error,
  currentUserId,
  messagesEndRef,
  className,
}: GroupChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);


  if (error) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center h-full p-4 text-center",
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading messages</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#5aabba] text-white rounded-lg hover:bg-[#4a9aaa] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-50",
      className
    )}>
      {/* Messages container */}
      <div 
        ref={scrollContainerRef}
        // onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {/* Loading indicator at top */}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-[#5aabba] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Messages */}
        <div className="space-y-1">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg 
                  className="w-8 h-8 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No messages yet</p>
              <p className="text-xs text-gray-500">Start the conversation by sending a message</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId === currentUserId}
                previousMessage={index > 0 ? messages[index - 1] : undefined}
                nextMessage={index < messages.length - 1 ? messages[index + 1] : undefined}
              />
            ))
          )}
        </div>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator typingUsers={typingUsers} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}




