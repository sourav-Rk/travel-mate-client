import { useEffect, useRef, useState, useMemo } from "react";
import type { GuideChatMessage, GuideChatRoom } from "@/types/guide-chat";
import { GuideChatMessageBubble } from "./GuideChatMessageBubble";
import { GuideChatComposer } from "./GuideChatComposer";
import { BookingPaymentSection } from "./BookingPaymentSection";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/constants/api/socketEvents";
import { useAcceptQuote, useDeclineQuote } from "@/hooks/local-guide-booking/useLocalGuideBooking";
import type { GuideChatMediaAttachment } from "@/types/guide-chat";

interface GuideChatWindowProps {
  room: GuideChatRoom;
  currentUserId: string;
  initialMessages: GuideChatMessage[];
  onSendMessage: (
    content: string,
    onSent?: () => void,
    attachments?: GuideChatMediaAttachment[]
  ) => void;
  isSending?: boolean;
  scrollToQuoteId?: string | null;
  onQuoteScrolled?: () => void;
}

const getParticipantName = (participant: GuideChatRoom["participants"][0]): string => {
  if (participant.firstName && participant.lastName) {
    return `${participant.firstName} ${participant.lastName}`.trim();
  }
  if (participant.firstName) {
    return participant.firstName;
  }
  if (participant.role === "guide") {
    return "Local Guide";
  }
  return "Traveller";
};

const quickActions = ["Are you available this weekend?", "Can we discuss rates?"];

export function GuideChatWindow({
  room,
  currentUserId,
  initialMessages,
  onSendMessage,
  isSending,
  scrollToQuoteId,
  onQuoteScrolled,
}: GuideChatWindowProps) {
  const [messages, setMessages] = useState<GuideChatMessage[]>(initialMessages);
  const { socket } = useSocket();
  const listRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: acceptQuote } = useAcceptQuote();
  const { mutateAsync: declineQuote } = useDeclineQuote();

  const otherParticipant = useMemo(() => {
    return room.participants.find((p) => p.userId !== currentUserId);
  }, [room.participants, currentUserId]);

  const participantName = useMemo(() => {
    return otherParticipant ? getParticipantName(otherParticipant) : "Unknown User";
  }, [otherParticipant]);

  useEffect(() => {
    setMessages(initialMessages);
    scrollToBottom();
  }, [initialMessages, room._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: GuideChatMessage) => {
      if (payload.guideChatRoomId !== room._id) return;
      setMessages((prev) => {
        // Check if this message already exists
        const exists = prev.some((msg) => msg._id === payload._id);
        if (exists) return prev;
        
        // Check if this is the server version of an optimistic message
        // Match by senderId, message content, and approximate timestamp
        const optimisticIndex = prev.findIndex((msg) => {
          const isOptimistic = 'tempId' in msg;
          const matchesSender = msg.senderId === payload.senderId;
          const matchesContent = msg.message === payload.message;
          const isRecent = Math.abs(new Date(msg.createdAt).getTime() - new Date(payload.createdAt).getTime()) < 5000;
          return isOptimistic && matchesSender && matchesContent && isRecent;
        });

        if (optimisticIndex >= 0) {
          // Replace optimistic message with server message
          const updated = [...prev];
          updated[optimisticIndex] = payload;
          return updated;
        }
        
        // Add new message
        return [...prev, payload];
      });
      scrollToBottom();
    };

    socket.on(SOCKET_EVENTS.SERVER.GUIDE_SERVICE_NEW_MESSAGE, handleNewMessage);
    return () => {
      socket.off(SOCKET_EVENTS.SERVER.GUIDE_SERVICE_NEW_MESSAGE, handleNewMessage);
    };
  }, [socket, room._id, currentUserId]);

  const handleSendMessageOptimistic = (
    content: string,
    attachments?: GuideChatMediaAttachment[]
  ) => {
    const hasAttachments = attachments && attachments.length > 0;
    if (!content.trim() && !hasAttachments) return;

    // Create optimistic message
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const messageType = hasAttachments ? "media" : "text";
    const optimisticMessage: GuideChatMessage & { tempId?: string } = {
      _id: tempId,
      guideChatRoomId: room._id,
      senderId: currentUserId,
      senderRole: room.participants.find((p) => p.userId === currentUserId)?.role || "client",
      messageType: messageType,
      message: content === "[attachment]" ? undefined : content,
      mediaAttachments: hasAttachments ? attachments : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tempId,
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage as GuideChatMessage]);
    scrollToBottom();

    // Send message
    onSendMessage(content, () => {
      // If server message doesn't arrive within 3 seconds, remove optimistic message
      setTimeout(() => {
        setMessages((prev) => {
          const hasServerVersion = prev.some(
            (msg) =>
              msg._id !== tempId &&
              msg.senderId === currentUserId &&
              msg.message === content &&
              !('tempId' in msg)
          );
          if (!hasServerVersion) {
            return prev.filter((msg) => !('tempId' in msg) || msg._id !== tempId);
          }
          return prev;
        });
      }, 3000);
    }, attachments);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  // Scroll to quote when scrollToQuoteId changes
  useEffect(() => {
    if (!scrollToQuoteId || messages.length === 0) return;

    // Find the message with the quote
    const quoteMessage = messages.find(
      (msg) =>
        msg.messageType === "quote" &&
        msg.metadata &&
        (msg.metadata as { quoteId?: string }).quoteId === scrollToQuoteId
    );

    if (!quoteMessage) return;

    // Wait for DOM to update, then scroll
    setTimeout(() => {
      const quoteElement = document.querySelector(
        `[data-quote-id="${scrollToQuoteId}"]`
      );
      if (quoteElement) {
        quoteElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight briefly
        quoteElement.classList.add("ring-2", "ring-yellow-400", "ring-offset-2");
        setTimeout(() => {
          quoteElement.classList.remove("ring-2", "ring-yellow-400", "ring-offset-2");
        }, 2000);
        onQuoteScrolled?.();
      }
    }, 100);
  }, [scrollToQuoteId, messages, onQuoteScrolled]);

  return (
    <section className="w-full h-full flex flex-col bg-[rgba(245,241,232,0.6)] overflow-hidden">
      <header className="flex-shrink-0 border-b border-slate-200/70 bg-white/80 px-6 py-4 flex items-center gap-3">
        {otherParticipant?.profileImage ? (
          <img
            src={otherParticipant.profileImage}
            alt={participantName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {participantName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {participantName}
          </p>
          <p className="text-xs text-slate-500">
            {room.latestContext?.postId
              ? `From post #${room.latestContext.postId.slice(-4)}`
              : otherParticipant?.role === "guide"
              ? "Local Guide"
              : "Traveller"}
          </p>
        </div>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {/* Booking Payment Card */}
        <BookingPaymentSection room={room} currentUserId={currentUserId} />

        {messages.map((message) => {
          const currentUserParticipant = room.participants.find(
            (p) => p.userId === currentUserId
          );
          const isTraveller = currentUserParticipant?.role === "client";
          return (
            <GuideChatMessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
              isTraveller={isTraveller}
              onAcceptQuote={async (quoteId) => {
                try {
                  await acceptQuote(quoteId);
                  // Messages will be refreshed via query invalidation in the hook
                } catch (error) {
                  // Error is handled by the hook
                }
              }}
              onDeclineQuote={async (quoteId) => {
                try {
                  await declineQuote({ quoteId });
                  // Messages will be refreshed via query invalidation in the hook
                } catch (error) {
                  // Error is handled by the hook
                }
              }}
            />
          );
        })}
      </div>

      <div className="flex-shrink-0">
        <GuideChatComposer
          disabled={isSending}
          onSend={handleSendMessageOptimistic}
          quickActions={quickActions}
          guideChatRoomId={room._id}
          isGuide={
            room.participants.find((p) => p.userId === currentUserId)?.role ===
            "guide"
          }
        />
      </div>
    </section>
  );
}