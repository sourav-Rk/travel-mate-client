"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/SocketContext";
import { useParams } from "react-router-dom";
import { useClientAuth } from "@/hooks/auth/useAuth";


type Message = {
  id: string;
  sender: "client" | "guide";
  text: string;
  timestamp: string;
};

export default function GuideClientChatWindow({
  initialMessages=[],
  chatRoomId,
  className,
}: {
  initialMessages?: Message[];
  chatRoomId: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected } = useSocket();
  const { bookingId, clientId  } = useParams<{
    bookingId: string;
    clientId: string;
  }>();
  const user = useClientAuth();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (msg: any) => {
      console.log("📩 New message received:", msg);
      setMessages((prev) => [
        ...prev,
        {
          id: msg._id || `srv-${Date.now()}`,
          sender: msg.senderType,
          text: msg.message,
          timestamp: msg.createdAt || new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  const guideAvatar = undefined;
  const clientAvatar = undefined;

  const items = useMemo(() => messages, [messages]);

  function handleSend(text: string) {
    if (!socket || !isConnected || !user?.clientInfo?.id || !chatRoomId) {
      console.warn("⚠️ Missing data: socket/chatRoomId/userId");
      return;
    }

    socket.emit("send_message", {
      chatRoomId,
      senderId: user.clientInfo.id,
      senderType: "client",
      receiverId: clientId,
      receiverType: "guide",
      message: text,
      contextType: "guide_client",
      contextId: bookingId,
    });

    console.log("📤 Sent message:", text);
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="mx-auto max-w-2xl space-y-3">
          {items.map((m, idx) => (
            <MessageBubble
              key={m.id}
              message={{
                ...m,
                avatarUrl: m.sender === "guide" ? guideAvatar : clientAvatar,
                name: m.sender === "guide" ? "sourav" : "You",
              }}
              isOwn={m.sender === "guide"}
              showAvatar={
                // Show avatar for the first message in a run from the same sender
                idx === 0 || items[idx - 1].sender !== m.sender
              }
            />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <ChatComposer onSend={handleSend} />
    </div>
  );
}
