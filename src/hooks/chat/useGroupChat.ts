import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import type { GroupMessage, TypingUser, GroupChatState } from "@/types/group-chatType";

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
  const sendMessage = useCallback(async (message: string) => {
    if (!socket || !groupChatId || !message.trim()) return;

    console.log("🔵 Frontend: Sending group message:", { groupChatId, message });

    try {
      socket.emit("send_group_message", { groupChatId, message }, (response: any) => {
        console.log("🔵 Frontend: Message response:", response);
        if (response?.success) {
          console.log("Message sent successfully");
        } else {
          setState(prev => ({ 
            ...prev, 
            error: response?.error || "Failed to send message" 
          }));
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setState(prev => ({ 
        ...prev, 
        error: "Failed to send message" 
      }));
    }
  }, [socket, groupChatId]);

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
    if (!socket || !enabled) return;

    const handleNewMessage = (message: GroupMessage) => {
      console.log("new message received",message)
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, message] 
      }));
      scrollToBottom();
    };

    const handleUserTyping = (data: { userId: string; groupChatId: string; timestamp: Date }) => {
      console.log("user typing",data.userId,data.groupChatId)
      if (data.userId !== clientInfo?.id) {
        setState(prev => {
          const existingTypingUser = prev.typingUsers.find(u => u.userId === data.userId);
          if (!existingTypingUser) {
            return {
              ...prev,
              typingUsers: [...prev.typingUsers, {
                userId: data.userId,
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
      setState(prev => ({
        ...prev,
        typingUsers: prev.typingUsers.filter(u => u.userId !== data.userId)
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
