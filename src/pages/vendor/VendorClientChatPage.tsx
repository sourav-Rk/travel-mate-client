import { ChatSidebar } from "@/components/chat/chatSideBar/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useGetMessagesQuery } from "@/hooks/chat/useChat";
import { getMessages } from "@/services/chat/chat.service";
import type { ChatListItemDTO, Participant, ChatMessage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";

export default function VendorClientChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatListItemDTO | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const hasStartedChatRef = useRef(false);
  const startChatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const user = useClientAuth();
  const { isConnected, socket } = useSocket();
  const isLoadingMoreRef = useRef(false);

  const handleRoomSelect = (room: ChatListItemDTO) => {
    setSelectedRoom(room);
    setMessages([]);
    setHasMore(true);
    setInitialLoadComplete(false);
    setHasStartedChat(false);
  };


  useEffect(() => {
    if (!socket) return;

    const handleChatJoined = (data: any) => {
      console.log("✅ Chat joined successfully:", data);
    };

    const handleChatError = (err: any) => {
      console.error("❌ Chat error:", err);
    };

    socket.on("chat_joined", handleChatJoined);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("chat_joined", handleChatJoined);
      socket.off("chat_error", handleChatError);
    };
  }, [socket]);

  // Start chat when a room is selected
  useEffect(() => {
    if (!socket || !isConnected || !selectedRoom || hasStartedChatRef.current) {
      return;
    }

    // Clear any existing timeout
    if (startChatTimeoutRef.current) {
      clearTimeout(startChatTimeoutRef.current);
    }

    // Debounce the start_chat emission
    startChatTimeoutRef.current = setTimeout(() => {
      if (hasStartedChatRef.current) {
        return; // Double-check to prevent race conditions
      }

      console.log("Emitting start_chat for selected room...");
      hasStartedChatRef.current = true;
      
      socket.emit("start_chat", {
        receiverId: selectedRoom.peer.userId,
        receiverType: selectedRoom.peer.userType,
        contextType: selectedRoom.contextType,
        contextId: selectedRoom.contextId,
      });
    }, 100); // 100ms debounce

    return () => {
      if (startChatTimeoutRef.current) {
        clearTimeout(startChatTimeoutRef.current);
      }
    };
  }, [socket, isConnected, selectedRoom]);

  // Fetch messages when a room is selected
  const { data: messageData, isLoading: messageLoading } = useGetMessagesQuery(
    {
      chatroomId: selectedRoom?.roomId || "",
      limit: 20,
      before: undefined,
      role: "vendor",
    },
    { enabled: !!selectedRoom && !initialLoadComplete }
  );

  // Handle initial messages load
  useEffect(() => {
    if (!messageData?.data || initialLoadComplete || !selectedRoom) return;

    setMessages(messageData.data);
    setInitialLoadComplete(true);

    if (messageData.data.length < 20) {
      setHasMore(false);
    }
  }, [messageData, initialLoadComplete, selectedRoom]);

  // Handle new messages from socket
  useEffect(() => {
    if (!socket || !selectedRoom) return;

    const handleNewMessage = (msg: any) => {
      if (msg.chatRoomId !== selectedRoom.roomId) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [
          ...prev,
          {
            _id: msg._id,
            message: msg.message,
            senderId: msg.senderId,
            senderType: msg.senderType,
            createdAt: msg.createdAt,
            status: msg.status,
          },
        ];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, selectedRoom]);

  // Load more messages for pagination
  const handleLoadMore = useCallback(
    async (before: string): Promise<ChatMessage[]> => {
      if (!selectedRoom?.roomId || !hasMore || isLoadingMoreRef.current) return [];

      isLoadingMoreRef.current = true;
      try {
        const response = await getMessages({
          chatroomId: selectedRoom.roomId,
          limit: 20,
          before: before,
          role: "vendor",
        });

        const olderMessages = response.data;

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const deduped = olderMessages.filter(
            (msg) => !existingIds.has(msg._id)
          );
          if (deduped.length === 0) return prev;
          return [...deduped, ...prev];
        });

        if (olderMessages.length < 20) {
          setHasMore(false);
        }

        return olderMessages;
      } catch (error) {
        console.error("Error fetching more messages:", error);
        return [];
      } finally {
        isLoadingMoreRef.current = false;
      }
    },
    [selectedRoom?.roomId, hasMore]
  );

  // Current user data
  const currentUser: Participant = {
    id: user.clientInfo.id,
    type: "vendor",
    name: user.clientInfo.firstName,
    avatarUrl: user.clientInfo?.profileImage,
    online: true,
  };

  const otherUser: Participant | null = selectedRoom ? {
    id: selectedRoom.peer.userId,
    type: selectedRoom.peer.userType as "client" | "guide" | "vendor",
    name: selectedRoom.peerInfo.firstName,
    avatarUrl: selectedRoom.peerInfo.profileImage,
    online: true, 
  } : null;

  const showLoading = selectedRoom && (messageLoading && !initialLoadComplete);

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      {/* Sidebar - Fixed width on desktop, hidden on mobile */}
      <div className="hidden md:flex md:w-80 lg:w-96 flex-shrink-0">
        <ChatSidebar
          role={user.clientInfo.role}
          selectedRoomId={selectedRoom?.roomId || null}
          onSelectRoom={handleRoomSelect}
          className="w-full h-full border-r border-gray-200 bg-white"
        />
      </div>

      {/* Chat window - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {showLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#5aabba] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Loading messages...</p>
            </div>
          </div>
        ) : selectedRoom && otherUser ? (
          <ChatWindow
            self={currentUser}
            other={otherUser}
            chatRoomId={selectedRoom.roomId}
            contextType={selectedRoom.contextType}
            contextId={selectedRoom.contextId || ""}
            initialMessages={messages}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            showHeader={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
              <p className="text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}