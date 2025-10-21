
// import { useCallback, useEffect, useRef, useState } from "react";
// import ChatHeader from "./ChatHeader";
// import MessageBubble from "./MessageBubble";
// import TypingIndicator from "./TypingIndicator";
// import ChatComposer from "./ChatComposer";
// import type { ChatMessage, Participant, ContextType } from "@/types/chat";
// import { useSocket } from "@/context/SocketContext";

// interface ChatWindowProps {
//   self: Participant;
//   other: Participant;
//   chatRoomId: string;
//   contextType: ContextType;
//   contextId: string;
//   initialMessages: ChatMessage[];
//   onLoadMore?: (before: string) => Promise<ChatMessage[]>;
//   hasMore?: boolean;
//   className?: string;
//   showHeader?: boolean;
// }

// export default function ChatWindow({
//   self,
//   other,
//   chatRoomId,
//   contextType,
//   contextId,
//   initialMessages = [],
//   onLoadMore,
//   hasMore = true,
//   className = "",
//   showHeader = true,
// }: ChatWindowProps) {
//   const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState(hasMore);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const isInitialLoad = useRef<boolean>(true);
//   const { socket, isConnected } = useSocket();

//   // Auto-scroll to bottom on new messages
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);


//   // Scroll to bottom on initial load and new messages
//   useEffect(() => {
//     if (isInitialLoad.current && messages.length > 0) {
//       setTimeout(() => {
//         scrollToBottom();
//         isInitialLoad.current = false;
//       }, 100);
//     }
//   }, [messages, scrollToBottom]);


//   // Handle socket events
//   useEffect(() => {
//     if (!socket) return;

//     const handleUserTyping = (data: any) => {
//       if (data.userId === other.id) {
//         setIsTyping(true);
//       }
//     };

//     const handleUserStoppedTyping = (data: any) => {
//       if (data.userId === other.id) {
//         setIsTyping(false);
//       }
//     };

//     socket.on("user_typing", handleUserTyping);
//     socket.on("user_stopped_typing", handleUserStoppedTyping);

//     return () => {
//       socket.off("user_typing", handleUserTyping);
//       socket.off("user_stopped_typing", handleUserStoppedTyping);
//     };
//   }, [socket, other.id]);

//   // Update messages when initialMessages change
//   useEffect(() => {
//     setMessages(initialMessages);
//   }, [initialMessages,messages]);

//   // Handle scroll for pagination
//   const handleScroll = useCallback(async () => {
//     const container = messagesContainerRef.current;
//     if (!container || isLoadingMore || !hasMoreMessages || !onLoadMore) return;

//     // Check if user scrolled to top (within 100px threshold)
//     if (container.scrollTop < 100) {
//       console.log("🔄 Triggering load more...");
//       setIsLoadingMore(true);

//       try {
//         const oldestMessage = messages[0];
//         if (!oldestMessage) {
//           setIsLoadingMore(false);
//           return;
//         }

//         // Save current scroll position
//         const currentScrollHeight = container.scrollHeight;

//         // Fetch older messages
//         const olderMessages = await onLoadMore(oldestMessage.createdAt);

//         if (olderMessages.length > 0) {
//           // Wait for DOM update then adjust scroll position
//           setTimeout(() => {
//             if (container) {
//               const newScrollHeight = container.scrollHeight;
//               container.scrollTop = newScrollHeight - currentScrollHeight;
//             }
//           }, 0);
//         } else {
//           setHasMoreMessages(false);
//         }
//       } catch (error) {
//         console.error("Error loading more messages:", error);
//       } finally {
//         setIsLoadingMore(false);
//       }
//     }
//   }, [messages, isLoadingMore, hasMoreMessages, onLoadMore]);

//   // Attach scroll event listener with throttle
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     let scrollTimeout: NodeJS.Timeout;
//     const throttledHandleScroll = () => {
//       if (scrollTimeout) clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(handleScroll, 100);
//     };

//     container.addEventListener("scroll", throttledHandleScroll);
//     return () => {
//       container.removeEventListener("scroll", throttledHandleScroll);
//       if (scrollTimeout) clearTimeout(scrollTimeout);
//     };
//   }, [handleScroll]);

//   const handleSend = (text: string) => {
//     if (!text.trim()) return;

//     if (!socket || !isConnected || !chatRoomId) {
//       console.warn("⚠️ Missing data: socket/chatRoomId/userId");
//       return;
//     }

//     socket.emit("send_message", {
//       chatRoomId,
//       senderId: self.id,
//       senderType: self.type,
//       receiverId: other.id,
//       receiverType: other.type,
//       message: text,
//       contextType: contextType,
//       contextId: contextId,
//     });
//   };

//   return (
//     <div className={`flex flex-col h-full bg-[#f5f7fa] ${className}`}>
//       {/* Header */}
//       {showHeader && <ChatHeader other={other} />}

//       {/* Messages Area */}
//       <div
//         ref={messagesContainerRef}
//         className="flex-1 overflow-y-auto px-4 md:px-6 py-4"
//         style={{ overscrollBehavior: "contain" }}
//       >
//         <div className="max-w-4xl mx-auto space-y-4">
//           {/* Loading More Indicator */}
//           {isLoadingMore && (
//             <div className="flex justify-center py-2">
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <div className="w-4 h-4 border-2 border-[#5aabba] border-t-transparent rounded-full animate-spin"></div>
//                 <span>Loading more messages...</span>
//               </div>
//             </div>
//           )}

//           {/* No More Messages Indicator */}
//           {!hasMoreMessages && messages.length > 0 && (
//             <div className="flex justify-center py-2">
//               <span className="text-xs text-gray-400">No more messages</span>
//             </div>
//           )}

//           {messages.length === 0 ? (
//             // Empty State
//             <div className="flex flex-col items-center justify-center h-full text-center py-12">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5aabba]/20 to-[#4a9aaa]/20 flex items-center justify-center mb-4">
//                 <svg className="w-10 h-10 text-[#5aabba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-[#333333] mb-2">No messages yet</h3>
//               <p className="text-sm text-gray-500 max-w-xs">Start the conversation with {other.name}</p>
//             </div>
//           ) : (
//             // Messages List
//             <>
//               {messages.map((msg, idx) => {
//                 const isOwn = msg.senderId === self.id;
//                 const prevMessage = messages[idx - 1];
//                 const showAvatar = idx === 0 || prevMessage.senderId !== msg.senderId;
//                 const showName = !isOwn && showAvatar;

//                 return (
//                   <MessageBubble
//                     key={msg._id}
//                     message={{
//                       text: msg.message,
//                       timestamp: msg.createdAt,
//                     }}
//                     sender={{
//                       name: isOwn ? self.name : other.name,
//                       avatarUrl: isOwn ? self.avatarUrl : other.avatarUrl,
//                     }}
//                     isOwn={isOwn}
//                     showAvatar={showAvatar}
//                     showName={showName}
//                   />
//                 );
//               })}

//               {/* Typing Indicator */}
//               {isTyping && (
//                 <TypingIndicator
//                   sender={{
//                     name: other.name,
//                     avatarUrl: other.avatarUrl,
//                   }}
//                 />
//               )}
//             </>
//           )}

//           {/* Scroll Anchor */}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Composer */}
//       <ChatComposer onSend={handleSend} chatRoomId={chatRoomId} self={self} />
//     </div>
//   );
// }


import { useCallback, useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatComposer from "./ChatComposer";
import type { ChatMessage, Participant, ContextType } from "@/types/chat";
import { useSocket } from "@/context/SocketContext";

interface ChatWindowProps {
  self: Participant;
  other: Participant;
  chatRoomId: string;
  contextType: ContextType;
  contextId: string;
  initialMessages: ChatMessage[];
  onLoadMore?: (before: string) => Promise<ChatMessage[]>;
  hasMore?: boolean;
  className?: string;
  showHeader?: boolean;
}

export default function ChatWindow({
  self,
  other,
  chatRoomId,
  contextType,
  contextId,
  initialMessages = [],
  onLoadMore,
  hasMore = true,
  className = "",
  showHeader = true,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(hasMore);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef<boolean>(true);
  const { socket, isConnected } = useSocket();

  const hasMarkedDeliveredRef = useRef<boolean>(false);
  const hasMarkedReadRef = useRef<boolean>(false);

  // ✅ NEW: Mark messages as delivered when they are received
  const markMessagesAsDelivered = useCallback(() => {
    if (!socket || !isConnected || !chatRoomId || hasMarkedDeliveredRef.current) return;

    console.log("📨 Marking messages as delivered");
    socket.emit("mark_messages_delivered", {
      chatRoomId,
      userId: self.id
    }, (response: any) => {
      if (response?.success) {
        console.log("✅ Messages marked as delivered");
        hasMarkedDeliveredRef.current = true;
      }
    });
  }, [socket, isConnected, chatRoomId, self.id]);

  // ✅ NEW: Mark messages as read when user views the chat
  const markMessagesAsRead = useCallback(() => {
    if (!socket || !isConnected || !chatRoomId || hasMarkedReadRef.current) return;

    console.log("👀 Marking messages as read");
    socket.emit("mark_messages_read", {
      chatRoomId,
      userId: self.id
    }, (response: any) => {
      if (response?.success) {
        console.log("✅ Messages marked as read");
        hasMarkedReadRef.current = true;
        
        // Update local messages state to show read status
        setMessages(prev => prev.map(msg => 
          msg.senderId === other.id && msg.status !== "read" 
            ? { ...msg, status: "read" as const }
            : msg
        ));
      }
    });
  }, [socket, isConnected, chatRoomId, self.id, other.id]);

  // Auto-mark messages as delivered when component mounts
  useEffect(() => {
    if (messages.length > 0) {
      markMessagesAsDelivered();
    }
  }, [messages.length, markMessagesAsDelivered]);

  // Auto-mark messages as read when user is active in chat
  useEffect(() => {
    markMessagesAsRead();
    
    // Also mark as read when user scrolls to bottom (indicating they're viewing messages)
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;

      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isAtBottom) {
        markMessagesAsRead();
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [markMessagesAsRead]);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        isInitialLoad.current = false;
      }, 100);
    }
  }, [messages, scrollToBottom]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: any) => {
      if (data.userId === other.id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      if (data.userId === other.id) {
        setIsTyping(false);
      }
    };

    // ✅ NEW: Handle new messages with status tracking
    const handleNewMessage = (msg: any) => {
      console.log("📩 New message received:", msg);
      
      setMessages(prev => {
        const exists = prev.some(m => m._id === msg._id);
        if (exists) return prev;
        
        const newMessage: ChatMessage = {
          _id: msg._id,
          message: msg.message,
          senderId: msg.senderId,
          senderType: msg.senderType,
          status: msg.status || "sent",
          createdAt: msg.createdAt,
          readAt: msg.readAt,
          deliveredTo: msg.deliveredTo || []
        };

        // If this is a message from the other user, mark as delivered immediately
        if (msg.senderId === other.id) {
          markMessagesAsDelivered();
          markMessagesAsRead(); // Also mark as read if user is actively viewing
        }

        return [...prev, newMessage];
      });

      // Scroll to bottom for new messages
      setTimeout(() => scrollToBottom(), 100);
    };

    // ✅ NEW: Handle messages delivered event
    const handleMessagesDelivered = (data: any) => {
      console.log("📨 Messages delivered event:", data);
      if (data.userId === other.id) {
        // Update messages sent by current user to show delivered status
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg._id) &&
          msg.senderId === self.id && msg.status === "sent"
            ? { ...msg, status: "delivered" as const }
            : msg
        ));
      }
    };

    // ✅ NEW: Handle messages read event
    const handleMessagesRead = (data: any) => {
      console.log("👀 Messages read event:", data);
      if (data.userId === other.id) {
        // Update messages sent by current user to show read status
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg._id) &&
          msg.senderId === self.id && (msg.status === "sent" || msg.status === "delivered") 
            ? { ...msg, status: "read" as const, readAt: data.readAt || new Date().toISOString() }
            : msg
        ));
      }
    };

    // Set up all event listeners
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);
    socket.on("new_message", handleNewMessage);
    socket.on("messages_delivered", handleMessagesDelivered);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
      socket.off("new_message", handleNewMessage);
      socket.off("messages_delivered", handleMessagesDelivered);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, other.id, self.id, markMessagesAsDelivered, markMessagesAsRead, scrollToBottom]);

  // Update messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
    // Reset flags when messages change
    hasMarkedDeliveredRef.current = false;
    hasMarkedReadRef.current = false;
  }, [initialMessages]);

  // Handle scroll for pagination
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !hasMoreMessages || !onLoadMore) return;

    // Check if user scrolled to top (within 100px threshold)
    if (container.scrollTop < 100) {
      console.log("🔄 Triggering load more...");
      setIsLoadingMore(true);

      try {
        const oldestMessage = messages[0];
        if (!oldestMessage) {
          setIsLoadingMore(false);
          return;
        }

        // Save current scroll position
        const currentScrollHeight = container.scrollHeight;

        // Fetch older messages
        const olderMessages = await onLoadMore(oldestMessage.createdAt);

        if (olderMessages.length > 0) {
          // Wait for DOM update then adjust scroll position
          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - currentScrollHeight;
            }
          }, 0);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error("Error loading more messages:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [messages, isLoadingMore, hasMoreMessages, onLoadMore]);

  // Attach scroll event listener with throttle
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    container.addEventListener("scroll", throttledHandleScroll);
    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    if (!socket || !isConnected || !chatRoomId) {
      console.warn("⚠️ Missing data: socket/chatRoomId/userId");
      return;
    }

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      message: text,
      senderId: self.id,
      senderType: self.type,
      status: "sent",
      createdAt: new Date().toISOString(),
      deliveredTo: []
    };

    // Add optimistic message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Scroll to bottom for the new message
    setTimeout(() => scrollToBottom(), 100);

    socket.emit("send_message", {
      chatRoomId,
      senderId: self.id,
      senderType: self.type,
      receiverId: other.id,
      receiverType: other.type,
      message: text,
      contextType: contextType,
      contextId: contextId,
    }, (response: any) => {
      if (response?.success) {
        // Replace optimistic message with real message from server
        setMessages(prev => prev.map(msg => 
          msg._id === optimisticMessage._id 
            ? response.message 
            : msg
        ));
      } else {
        // Handle send failure - mark message as failed
        setMessages(prev => prev.map(msg => 
          msg._id === optimisticMessage._id 
            ? { ...msg, status: "failed" as any }
            : msg
        ));
      }
    });
  };

  return (
    <div className={`flex flex-col h-full bg-[#f5f7fa] ${className}`}>
      {/* Header */}
      {showHeader && <ChatHeader other={other} />}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-[#5aabba] border-t-transparent rounded-full animate-spin"></div>
                <span>Loading more messages...</span>
              </div>
            </div>
          )}

          {/* No More Messages Indicator */}
          {!hasMoreMessages && messages.length > 0 && (
            <div className="flex justify-center py-2">
              <span className="text-xs text-gray-400">No more messages</span>
            </div>
          )}

          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5aabba]/20 to-[#4a9aaa]/20 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#5aabba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">No messages yet</h3>
              <p className="text-sm text-gray-500 max-w-xs">Start the conversation with {other.name}</p>
            </div>
          ) : (
            // Messages List
            <>
              {messages.map((msg, idx) => {
                const isOwn = msg.senderId === self.id;
                const prevMessage = messages[idx - 1];
                const showAvatar = idx === 0 || prevMessage?.senderId !== msg.senderId;
                const showName = !isOwn && showAvatar;

                return (
                  <MessageBubble
                    key={msg._id}
                    message={{
                      text: msg.message,
                      timestamp: msg.createdAt,
                      status: msg.status,
                      readAt: msg.readAt,
                    }}
                    sender={{
                      name: isOwn ? self.name : other.name,
                      avatarUrl: isOwn ? self?.avatarUrl : other?.avatarUrl,
                    }}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    showName={showName}
                  />
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <TypingIndicator
                  sender={{
                    name: other.name,
                    avatarUrl: other.avatarUrl,
                  }}
                />
              )}
            </>
          )}

          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <ChatComposer onSend={handleSend} chatRoomId={chatRoomId} self={self} />
    </div>
  );
}