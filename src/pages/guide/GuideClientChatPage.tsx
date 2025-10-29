import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useGetMessagesQuery } from "@/hooks/chat/useChat";
import { useClientDetailsForGuideQuery } from "@/hooks/client/useClientProfile";
import { getMessages } from "@/services/chat/chat.service";
import type { Client } from "@/services/client/client.service";
import type { Participant, ChatMessage } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

export default function GuideClientChatPage() {
  const { bookingId, clientId } = useParams<{
    bookingId: string;
    clientId: string;
  }>();

  const [client, setClient] = useState<Client>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const hasStartedChatRef = useRef(false);
  const startChatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { data: userData, isLoading: userLoading } =
    useClientDetailsForGuideQuery(clientId!);
  const user = useClientAuth();
  const { isConnected, socket } = useSocket();
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    if (!userData?.client) return;
    setClient(userData.client);
  }, [userData]);

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
      console.log("Cleaning up socket listeners");
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

      console.log("Emitting start_chat...");
      hasStartedChatRef.current = true;
      
      socket.emit("start_chat", {
        receiverId: clientId,
        receiverType: "client",
        contextType: "guide_client",
        contextId: bookingId,
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
    clientId,
    bookingId,
  ]);

  const { data: messageData, isLoading: messageLoading } = useGetMessagesQuery(
    {
      chatroomId: chatRoomId || "",
      limit: 20,
      before: undefined,
      role: "guide",
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

  // Handle new messages from socket
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
            chatRoomId: msg.chatRoomId,
            deliveredTo: msg.deliveredTo,
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
          role: "guide",
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
    type: "guide",
    name: user.clientInfo.firstName,
    avatarUrl: user.clientInfo?.profileImage,
    online: true,
  };

  const otherUser: Participant = {
    id: clientId!,
    type: "client",
    name: client?.firstName || "User",
    avatarUrl: client?.profileImage,
    online: true,
  };

  if (userLoading || !chatRoomId || (messageLoading && !initialLoadComplete)) {
    return (
      <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
        <main className="flex-1 md:ml-64 lg:ml-64 flex flex-col h-full items-center justify-center">
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
      <main className="flex-1 md:ml-64 lg:ml-64 flex flex-col h-full">
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
