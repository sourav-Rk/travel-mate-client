import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import type { GroupMessage, TypingUser, GroupChatState, MediaAttachment } from "@/types/group-chatType";

interface UseGroupChatProps {
  groupChatId: string | null;
  enabled?: boolean;
}

export function useGroupChat({ groupChatId, enabled = true }: UseGroupChatProps) {
  const { socket, isConnected } = useSocket();
  const { clientInfo } = useClientAuth();
  const [state, setState] = useState<GroupChatState>({
    messages: [],
    typingUsers: [],
    onlineMembers: [],
    isLoading: false,
    error: null,
  });


  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement|null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Join group chat
  const joinGroupChat = useCallback(async (packageId: string) => {
    if (!socket || !isConnected) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      socket.emit("join_group_chat", { packageId }, (response: any) => {
        if (response?.success) {
          console.log("Successfully joined group chat:", response.groupChatId);
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: response?.error || "Failed to join group chat" 
          }));
        }
      });
    } catch (error) {
      console.error("Error joining group chat:", error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to join group chat" 
      }));
    }
  }, [socket, isConnected]);

  // Leave group chat
  const leaveGroupChat = useCallback(async () => {
    if (!socket || !groupChatId) return;

    try {
      socket.emit("leave_group_chat", { groupChatId }, (response: any) => {
        if (response?.success) {
          console.log("Successfully left group chat");
          setState(prev => ({ 
            ...prev, 
            messages: [], 
            typingUsers: [], 
            onlineMembers: [] 
          }));
        }
      });
    } catch (error) {
      console.error("Error leaving group chat:", error);
    }
  }, [socket, groupChatId]);

  // Send message
  const sendMessage = useCallback(async (message: string, mediaAttachments?: MediaAttachment[]) => {
    const hasText = message && message.trim().length > 0;
    const hasMedia = mediaAttachments && mediaAttachments.length > 0;

    if (!socket || !groupChatId || (!hasText && !hasMedia) || !clientInfo?.id) return;

    console.log("🔵 Frontend: Sending group message:", { groupChatId, message, mediaAttachments });

    // Construct sender name from firstName and lastName
    const senderName = clientInfo.firstName 
      ? `${clientInfo.firstName}${clientInfo.lastName ? ` ${clientInfo.lastName}` : ''}`.trim()
      : "You";
    
    // Store current user ID for comparison (normalize to string)
    const currentUserIdStr = String(clientInfo.id);
    
    // Create optimistic message with proper senderId (as string) for immediate UI update
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage: GroupMessage = {
      _id: tempId,
      groupChatId: groupChatId,
      senderId: currentUserIdStr, // Ensure it's a string
      senderType: clientInfo.role as "client" | "guide" | "vendor",
      senderName: senderName,
      message: message || "",
      mediaAttachments: mediaAttachments || [],
      messageType: hasText && hasMedia ? "mixed" : hasMedia ? "media" : "text",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optimistic message immediately for instant UI feedback
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, optimisticMessage]
    }));

    // Scroll to bottom immediately
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    try {
      socket.emit("send_group_message", { 
        groupChatId, 
        message: message || "",
        mediaAttachments: mediaAttachments || []
      }, (response: any) => {
        console.log("🔵 Frontend: Message ack response:", response);
        if (response?.success && response?.message) {
          // Normalize senderId from server response - CRITICAL for alignment
          const serverSenderId = String(response.message.senderId || currentUserIdStr);
          console.log("🔵 ACK: Server senderId:", serverSenderId, "Current userId:", currentUserIdStr, "Match:", serverSenderId === currentUserIdStr);
          
          // The socket event should have already replaced the optimistic message
          // But if it hasn't, we'll replace it here as a fallback
          setState(prev => {
            // FIRST: Check if server message already exists (added by socket event)
            // This is the most common case - socket event arrives before ACK
            const existingIndex = prev.messages.findIndex(msg => msg._id === response.message._id);
            if (existingIndex !== -1) {
              // Message exists (socket event already handled it), just ensure correct data
              const updatedMessages = [...prev.messages];
              const existingMsg = updatedMessages[existingIndex];
              const existingSenderId = String(existingMsg.senderId || "");
              
              // Only update if senderId is different (shouldn't happen, but safety check)
              if (existingSenderId !== serverSenderId) {
                console.log("🔄 ACK: Updating existing message senderId from", existingSenderId, "to", serverSenderId);
                updatedMessages[existingIndex] = {
                  ...existingMsg,
                  senderId: serverSenderId, // Always use normalized string
                  senderName: response.message.senderName || existingMsg.senderName || senderName,
                };
                return { ...prev, messages: updatedMessages };
              }
              // Message already exists with correct data, no update needed
              console.log("✅ ACK: Message already exists with correct data, no update needed");
              return prev;
            }
            
            // SECOND: Check if optimistic message still exists by tempId
            // This happens if ACK arrives before socket event
            const optimisticIndex = prev.messages.findIndex(msg => msg._id === tempId);
            if (optimisticIndex !== -1) {
              // Replace optimistic message with server response
              console.log("🔄 ACK: Replacing optimistic message by tempId (socket event hasn't arrived yet)");
              const updatedMessages = [...prev.messages];
              updatedMessages[optimisticIndex] = {
                _id: response.message._id,
                groupChatId: response.message.groupChatId || groupChatId,
                senderId: serverSenderId, // Always use normalized string
                senderType: response.message.senderType || clientInfo.role as "client" | "guide" | "vendor",
                senderName: response.message.senderName || senderName,
                message: response.message.message !== undefined ? response.message.message : message || "",
                mediaAttachments: response.message.mediaAttachments || mediaAttachments || [],
                messageType: response.message.messageType || optimisticMessage.messageType || "text",
                createdAt: response.message.createdAt ? new Date(response.message.createdAt) : new Date(),
                updatedAt: response.message.updatedAt ? new Date(response.message.updatedAt) : new Date(),
              };
              console.log("✅ ACK: Replaced optimistic message. senderId:", serverSenderId);
              return { ...prev, messages: updatedMessages };
            }
            
            // THIRD: If message doesn't exist yet (neither optimistic nor server), add it
            // This shouldn't happen normally, but is a safety net
            console.log("⚠️ ACK: Message doesn't exist in state, adding it (shouldn't happen)");
            const newMessage: GroupMessage = {
              _id: response.message._id,
              groupChatId: response.message.groupChatId || groupChatId,
              senderId: serverSenderId,
              senderType: response.message.senderType || clientInfo.role as "client" | "guide" | "vendor",
              senderName: response.message.senderName || senderName,
              message: response.message.message || message || "",
              mediaAttachments: response.message.mediaAttachments || mediaAttachments || [],
              messageType: response.message.messageType || optimisticMessage.messageType || "text",
              createdAt: response.message.createdAt ? new Date(response.message.createdAt) : new Date(),
              updatedAt: response.message.updatedAt ? new Date(response.message.updatedAt) : new Date(),
            };
            return { ...prev, messages: [...prev.messages, newMessage] };
          });
        } else {
          // Remove optimistic message on error
          setState(prev => ({
            ...prev,
            messages: prev.messages.filter(msg => msg._id !== tempId),
            error: response?.error || "Failed to send message"
          }));
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg._id !== tempId),
        error: "Failed to send message"
      }));
    }
  }, [socket, groupChatId, clientInfo, scrollToBottom]);

  // Start typing
  const startTyping = useCallback(() => {
    if (!socket || !groupChatId || !clientInfo?.id) return;

    console.log("🔵 Frontend: Starting typing:", { groupChatId, userId: clientInfo.id });

    socket.emit("group_chat_start_typing", { 
      groupChatId, 
      userId: clientInfo.id 
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [socket, groupChatId, clientInfo?.id]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!socket || !groupChatId || !clientInfo?.id) return;

    console.log("🔵 Frontend: Stopping typing:", { groupChatId, userId: clientInfo.id });

    socket.emit("group_chat_stop_typing", { 
      groupChatId, 
      userId: clientInfo.id 
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, groupChatId, clientInfo?.id]);

  // Load messages
  const loadMessages = useCallback(async (limit = 20, before?: string) => {
    if (!socket || !groupChatId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      socket.emit("get_group_messages", { groupChatId, limit, before }, (response: any) => {
        if (response?.success) {
          setState(prev => ({ 
            ...prev, 
            messages: response.messages || [], 
            isLoading: false 
          }));
          scrollToBottom();
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: response?.error || "Failed to load messages" 
          }));
        }
      });
    } catch (error) {
      console.error("Error loading messages:", error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to load messages" 
      }));
    }
  }, [socket, groupChatId, scrollToBottom]);

  // Get online members
  const getOnlineMembers = useCallback(async () => {
    if (!socket || !groupChatId) return;

    try {
      socket.emit("get_group_online_members", { groupChatId }, (response: any) => {
        if (response?.success) {
          setState(prev => ({ 
            ...prev, 
            onlineMembers: response.onlineMembers || [] 
          }));
        }
      });
    } catch (error) {
      console.error("Error getting online members:", error);
    }
  }, [socket, groupChatId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !enabled || !clientInfo?.id) return;

    const currentUserIdStr = String(clientInfo.id);

    const handleNewMessage = (msg: any) => {
      console.log("📨 New group message received:", msg);
      
      // Normalize senderId to string for comparison - CRITICAL for alignment
      const msgSenderId = String(msg.senderId || "");
      const isFromCurrentUser = msgSenderId === currentUserIdStr;
      
      setState(prev => {
        // FIRST: Check if message already exists by _id (server message ID)
        const existingMessageIndex = prev.messages.findIndex(m => m._id === msg._id);
        if (existingMessageIndex !== -1) {
          // Message already exists with this server ID, update it to ensure correct data
          console.log("🔄 Message already exists with server ID, ensuring correct data");
          const updatedMessages = [...prev.messages];
          const existingMsg = updatedMessages[existingMessageIndex];
          
          // Always update senderId to normalized string to ensure alignment works
          const normalizedExistingSenderId = String(existingMsg.senderId || "");
          if (normalizedExistingSenderId !== msgSenderId || 
              existingMsg.senderName !== (msg.senderName || existingMsg.senderName)) {
            updatedMessages[existingMessageIndex] = {
              ...existingMsg,
              senderId: msgSenderId, // Always use normalized string
              senderName: msg.senderName || existingMsg.senderName || (isFromCurrentUser ? "You" : "Unknown"),
              message: msg.message !== undefined ? msg.message : existingMsg.message,
              mediaAttachments: msg.mediaAttachments || existingMsg.mediaAttachments || [],
              messageType: msg.messageType || existingMsg.messageType || "text",
            };
            console.log("✅ Updated existing message with correct senderId:", msgSenderId);
            return { ...prev, messages: updatedMessages };
          }
          return prev; // No changes needed
        }

        // SECOND: Check for optimistic messages (temp ID) from current user
        // This is critical - we need to replace optimistic messages BEFORE adding new ones
        if (isFromCurrentUser) {
          // Find the MOST RECENT optimistic message from current user
          // Use a simpler approach: just find the last optimistic message from current user that's recent
          const now = Date.now();
          let optimisticIndex = -1;
          let mostRecentTime = 0;
          
          // Find the most recent optimistic message from current user (within last 60 seconds)
          prev.messages.forEach((m, index) => {
            if (!m._id || typeof m._id !== 'string' || !m._id.startsWith("temp-")) return;
            
            const msgSenderIdNormalized = String(m.senderId || "");
            if (msgSenderIdNormalized !== currentUserIdStr) return;
            
            // Check if message is recent (within 60 seconds)
            const msgTime = new Date(m.createdAt).getTime();
            const timeDiff = now - msgTime;
            if (timeDiff >= 0 && timeDiff < 60000 && msgTime > mostRecentTime) {
              mostRecentTime = msgTime;
              optimisticIndex = index;
            }
          });
          
          if (optimisticIndex !== -1) {
            // Replace optimistic message with server response
            console.log("🔄 Socket: Replacing optimistic message at index", optimisticIndex, "with server message");
            const updatedMessages = [...prev.messages];
            const optimisticMsg = updatedMessages[optimisticIndex];
            
            updatedMessages[optimisticIndex] = {
              _id: msg._id,
              groupChatId: msg.groupChatId || optimisticMsg.groupChatId,
              senderId: msgSenderId, // Always normalized string - CRITICAL for alignment
              senderType: msg.senderType || optimisticMsg.senderType,
              senderName: msg.senderName || optimisticMsg.senderName || "You",
              message: msg.message !== undefined ? msg.message : optimisticMsg.message || "",
              mediaAttachments: msg.mediaAttachments || optimisticMsg.mediaAttachments || [],
              messageType: msg.messageType || optimisticMsg.messageType || "text",
              createdAt: msg.createdAt ? new Date(msg.createdAt) : optimisticMsg.createdAt,
              updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : new Date(),
            };
            console.log("✅ Socket: Replaced optimistic message. senderId:", msgSenderId);
            return { ...prev, messages: updatedMessages };
          } else {
            // No optimistic message found, but this is from current user
            // Remove any stale optimistic messages and add server message
            console.log("⚠️ Socket: No matching optimistic message found for current user. Adding server message.");
            const filteredMessages = prev.messages.filter(m => {
              if (!m._id || typeof m._id !== 'string') return true;
              // Remove any optimistic messages from current user that are older than 60 seconds
              if (m._id.startsWith("temp-") && String(m.senderId || "") === currentUserIdStr) {
                const msgTime = new Date(m.createdAt).getTime();
                const timeDiff = now - msgTime;
                if (timeDiff > 60000) {
                  console.log("🗑️ Removing stale optimistic message:", m._id);
                  return false; // Remove stale message
                }
              }
              return true;
            });
            
            // Add the server message
            const senderName = msg.senderName || (clientInfo.firstName 
              ? `${clientInfo.firstName}${clientInfo.lastName ? ` ${clientInfo.lastName}` : ''}`.trim()
              : "You");
            
            const newMessage: GroupMessage = {
              _id: msg._id,
              groupChatId: msg.groupChatId,
              senderId: msgSenderId, // Always normalized string
              senderType: msg.senderType,
              senderName: senderName,
              message: msg.message || "",
              mediaAttachments: msg.mediaAttachments || [],
              messageType: msg.messageType || "text",
              createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
              updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : new Date(),
            };
            console.log("✅ Socket: Added server message for current user. senderId:", msgSenderId);
            return { ...prev, messages: [...filteredMessages, newMessage] };
          }
        }
        
        // THIRD: This is a new message from another user (or a message that couldn't be matched)
        // Determine sender name
        let senderName = msg.senderName;
        if (!senderName) {
          if (isFromCurrentUser) {
            senderName = clientInfo.firstName 
              ? `${clientInfo.firstName}${clientInfo.lastName ? ` ${clientInfo.lastName}` : ''}`.trim()
              : "You";
          } else {
            senderName = "Unknown";
          }
        }
        
        const newMessage: GroupMessage = {
          _id: msg._id,
          groupChatId: msg.groupChatId,
          senderId: msgSenderId, // Always normalized string
          senderType: msg.senderType,
          senderName: senderName,
          message: msg.message || "",
          mediaAttachments: msg.mediaAttachments || [],
          messageType: msg.messageType || "text",
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : new Date(),
        };
        
        console.log("✅ Adding new message. senderId:", newMessage.senderId, "currentUserId:", currentUserIdStr, "isOwn:", newMessage.senderId === currentUserIdStr);
        
        return { 
          ...prev, 
          messages: [...prev.messages, newMessage] 
        };
      });
      
      // Scroll to bottom after a short delay to ensure DOM update
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    const handleUserTyping = (data: { userId: string; groupChatId: string; timestamp: Date }) => {
      console.log("user typing",data.userId,data.groupChatId)
      // Normalize IDs for comparison
      const dataUserId = String(data.userId || "");
      if (dataUserId !== currentUserIdStr) {
        setState(prev => {
          const existingTypingUser = prev.typingUsers.find(u => String(u.userId) === dataUserId);
          if (!existingTypingUser) {
            return {
              ...prev,
              typingUsers: [...prev.typingUsers, {
                userId: dataUserId,
                userType: "client", // This should be fetched from user data
                timestamp: data.timestamp
              }]
            };
          }
          return prev;
        });
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; groupChatId: string; timestamp: Date }) => {
      const dataUserId = String(data.userId || "");
      setState(prev => ({
        ...prev,
        typingUsers: prev.typingUsers.filter(u => String(u.userId) !== dataUserId)
      }));
    };

    const handleGroupChatJoined = (data: any) => {
      console.log("Joined group chat:", data);
      setState(prev => ({ ...prev, isLoading: false }));
      loadMessages();
      getOnlineMembers();
    };

    const handleGroupChatError = (data: any) => {
      console.error("Group chat error:", data);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: data.message 
      }));
    }; 

    // Register event listeners
    socket.on("new_group_message", handleNewMessage);
    socket.on("group_chat_user_typing", handleUserTyping);
    socket.on("group_chat_user_stopped_typing", handleUserStoppedTyping);
    socket.on("group_chat_joined", handleGroupChatJoined);
    socket.on("group_chat_error", handleGroupChatError);

    return () => {
      socket.off("new_group_message", handleNewMessage);
      socket.off("group_chat_user_typing", handleUserTyping);
      socket.off("group_chat_user_stopped_typing", handleUserStoppedTyping);
      socket.off("group_chat_joined", handleGroupChatJoined);
      socket.off("group_chat_error", handleGroupChatError);
    };
  }, [socket, enabled, clientInfo?.id, loadMessages, getOnlineMembers, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (groupChatId) {
        leaveGroupChat();
      }
    };
  }, [groupChatId, leaveGroupChat]);

  return {
    ...state,
    messagesEndRef,
    joinGroupChat,
    leaveGroupChat,
    sendMessage,
    startTyping,
    stopTyping,
    loadMessages,
    getOnlineMembers,
    scrollToBottom,
  };
}
