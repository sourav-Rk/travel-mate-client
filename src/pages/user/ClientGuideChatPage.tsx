import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useGetMessagesQuery } from "@/hooks/chat/useChat";
import { useGetGuideDetailsQuery } from "@/hooks/client/useGuide";
import { getMessages } from "@/services/chat/chat.service";
import type { GuideDetailsForClientDto } from "@/types/api/client";
import type { Participant, ChatMessage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ChatSidebar } from "@/components/chat/chatSideBar/ChatSidebar";

export default function ClientGuideChatPage() {
  const { bookingId, guideId } = useParams<{
    bookingId: string;
    guideId: string;
  }>();

  const [guide, setGuide] = useState<GuideDetailsForClientDto>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { data: guideData, isLoading: guideLoading } = useGetGuideDetailsQuery(
    guideId!
  );
  const user = useClientAuth();
  const { isConnected, socket } = useSocket();
  const isLoadingMoreRef = useRef(false);

  // Set guide data
  useEffect(() => {
    if (!guideData) return;
    setGuide(guideData.guide);
  }, [guideData]);

  // 🔥 FIX: Separate socket event listeners from chat initiation
  useEffect(() => {
    if (!socket) return;

    console.log("🎯 Setting up chat_joined listener...");

    const handleChatJoined = (data: any) => {
      console.log("✅ Chat joined successfully:", data);
      setChatRoomId(data.chatRoomId);
    };

    const handleChatError = (err: any) => {
      console.error("❌ Chat error:", err);
    };

    socket.on("chat_joined", handleChatJoined);
    socket.on("chat_error", handleChatError);

    // Cleanup only on unmount
    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("chat_joined", handleChatJoined);
      socket.off("chat_error", handleChatError);
    };
  }, [socket]); // Only depend on socket

  // 🔥 FIX: Separate chat initiation logic
  useEffect(() => {
    if (!socket || !isConnected || !user?.clientInfo?.id || hasStartedChat) {
      console.log("⏸️ Skipping chat initiation:", {
        socket: !!socket,
        isConnected,
        hasStartedChat,
        userId: user?.clientInfo?.id,
      });
      return;
    }

    console.log("📡 Emitting start_chat...");
    socket.emit("start_chat", {
      receiverId: guideId,
      receiverType: "guide",
      contextType: "guide_client",
      contextId: bookingId,
    });
    setHasStartedChat(true);
  }, [
    socket,
    isConnected,
    user?.clientInfo?.id,
    guideId,
    bookingId,
    hasStartedChat,
  ]);

  // Fetch messages only when chatRoomId is available
  const { data: messageData, isLoading: messageLoading } = useGetMessagesQuery(
    {
      chatroomId: chatRoomId || "",
      limit: 20,
      before: undefined,
      role: "client",
    },

    { enabled: !!chatRoomId && !initialLoadComplete }
  );

  // Handle initial messages load
  useEffect(() => {
    if (!messageData?.data || initialLoadComplete) return;

    console.log("📥 Initial messages loaded:", messageData.data.length);
    setMessages(messageData.data);
    setInitialLoadComplete(true);

    if (messageData.data.length < 20) {
      setHasMore(false);
    }
  }, [messageData, initialLoadComplete]);

  // Handle new messages from socket
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    console.log("🎯 Setting up new_message listener for chatRoom:", chatRoomId);

    const handleNewMessage = (msg: any) => {
      console.log("📩 New message received:", msg);
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
      console.log("🧹 Cleaning up new_message listener");
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, chatRoomId]);

  // Load more messages for pagination
  const handleLoadMore = useCallback(
    async (before: string): Promise<ChatMessage[]> => {
      if (!chatRoomId || !hasMore || isLoadingMoreRef.current) return [];

      isLoadingMoreRef.current = true;
      console.log("🔄 Loading more messages...");

      try {
        const response = await getMessages({
          chatroomId: chatRoomId,
          limit: 20,
          before: before,
          role: "client",
        });

        const olderMessages = response.data;
        console.log("📥 Older messages loaded:", olderMessages.length);

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
    [chatRoomId, hasMore]
  );

  const currentUser: Participant = {
    id: user.clientInfo.id,
    type: "client",
    name: user.clientInfo.firstName,
    avatarUrl: user.clientInfo?.profileImage,
    online: true,
  };

  const otherUser: Participant = {
    id: guideId!,
    type: "guide",
    name: guide?.firstName || "Guide",
    avatarUrl: guide?.profileImage,
    online: true,
  };

  // Show loading state
  if (guideLoading || !chatRoomId || (messageLoading && !initialLoadComplete)) {
    return (
      <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
        <main className="flex-1 md:ml-80 flex flex-col h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#5aabba] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">
              {!chatRoomId ? "Connecting to chat..." : "Loading messages..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
  <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
    {/* Sidebar - Fixed width on desktop, hidden on mobile */}
    <div className="hidden md:flex md:w-80 lg:w-96 flex-shrink-0">
      <ChatSidebar
        role={user.clientInfo.role}
        selectedRoomId={chatRoomId}
        className="w-full h-full border-r border-gray-200 bg-white"
      />
    </div>

    {/* Chat window - Takes remaining space */}
    <div className="flex-1 flex flex-col min-w-0">
      {chatRoomId ? (
        <ChatWindow
          self={currentUser}
          other={otherUser}
          chatRoomId={chatRoomId}
          contextType="guide_client"
          contextId={bookingId!}
          initialMessages={messages}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showHeader={true}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  </div>
);

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      <main className="flex-1 md:ml-80 flex flex-col h-full">
        <ChatWindow
          self={currentUser}
          other={otherUser}
          chatRoomId={chatRoomId!}
          contextType="guide_client"
          contextId={bookingId!}
          initialMessages={messages}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showHeader={true}
        />
      </main>
    </div>
  );
}
