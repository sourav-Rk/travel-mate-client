import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useGetMessagesQuery } from "@/hooks/chat/useChat";
import { useGetVendorDetailsForClientQuery } from "@/hooks/client/useVendor";
import { getMessages } from "@/services/chat/chat.service";
import type {  VendorDetailsForClientDto } from "@/types/api/client";
import type { Participant, ChatMessage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";


export default function ClientVendorChatPage() {
  const { packageId, vendorId } = useParams<{
    packageId: string;
    vendorId: string;
  }>();

  const [vendor, setVendor] = useState<VendorDetailsForClientDto>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const hasStartedChatRef = useRef(false);
  const startChatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { data, isLoading } = useGetVendorDetailsForClientQuery(vendorId!);

  const user = useClientAuth();
  const { isConnected, socket } = useSocket();
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    if (!data) return;
    setVendor(data.data);
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleChatJoined = (data: any) => {
      console.log("Chat joined successfully:", data);
      setChatRoomId(data.chatRoomId);
    };

    const handleChatError = (err: any) => {
      console.error("Chat error:", err);
    };

    socket.on("chat_joined", handleChatJoined);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("chat_joined", handleChatJoined);
      socket.off("chat_error", handleChatError);
    };
  }, [socket]); 

  useEffect(() => {
    if (!socket || !isConnected || !user?.clientInfo?.id || hasStartedChatRef.current) {
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

      console.log("start_chat is emitting...");
      hasStartedChatRef.current = true;
      
      socket.emit("start_chat", {
        receiverId: vendorId,
        receiverType: "vendor",
        contextType: "vendor_client",
        contextId: packageId,
      });
    }, 100); // 100ms debounce

    return () => {
      if (startChatTimeoutRef.current) {
        clearTimeout(startChatTimeoutRef.current);
      }
    };
  }, [
    socket,
    isConnected,
    user?.clientInfo?.id,
    vendorId,
    packageId,
  ]);

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
    setMessages(messageData.data);
    setInitialLoadComplete(true);

    if (messageData.data.length < 20) {
      setHasMore(false);
    }
  }, [messageData, initialLoadComplete]);

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    const handleNewMessage = (msg: any) => {
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
  }, [socket, chatRoomId]);

  // Load more messages 
  const handleLoadMore = useCallback(
    async (before: string): Promise<ChatMessage[]> => {
      if (!chatRoomId || !hasMore || isLoadingMoreRef.current) return [];

      isLoadingMoreRef.current = true;

      try {
        const response = await getMessages({
          chatroomId: chatRoomId,
          limit: 20,
          before: before,
          role: "client",
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
    id: vendorId!,
    type: "vendor",
    name:  vendor?.agencyName!,
    avatarUrl: vendor?.profileImage || "",
    online: true,
  };

  // Show loading state
  if (isLoading || !chatRoomId || (messageLoading && !initialLoadComplete)) {
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
      <main className="flex-1 md:ml-80 flex flex-col h-full">
        <ChatWindow
          self={currentUser}
          other={otherUser}
          chatRoomId={chatRoomId!}
          contextType="vendor_client"
          contextId={packageId!}
          initialMessages={messages}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showHeader={true}
        />
      </main>
    </div>
  );

}