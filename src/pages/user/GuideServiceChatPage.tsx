import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { GuideChatSidebar } from "@/components/client/local-guide-chat/GuideChatSidebar";
import { GuideChatWindow } from "@/components/client/local-guide-chat/GuideChatWindow";
import {
  useCreateGuideChatRoom,
  useGuideChatMessages,
  useGuideChatRooms,
} from "@/hooks/guide-chat/useGuideChat";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/constants/api/socketEvents";
import type { GuideChatMediaAttachment } from "@/types/guide-chat";

type LocationState = {
  guideChatRoomId?: string;
  guideId?: string;
  guideProfileId?: string;
  postId?: string;
};

export default function GuideServiceChatPage() {
  const { data: rooms = [], isLoading: roomsLoading } = useGuideChatRooms();
  const { mutateAsync: createRoom } = useCreateGuideChatRoom();
  const { socket } = useSocket();
  const user = useClientAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room._id === selectedRoomId),
    [rooms, selectedRoomId]
  );

  const { data: messages = [], isLoading: messagesLoading } =
    useGuideChatMessages(selectedRoomId ?? "", 40);

  useEffect(() => {
    const state = location.state as LocationState | undefined;
    if (state?.guideChatRoomId) {
      setSelectedRoomId(state.guideChatRoomId);
      navigate(".", { replace: true, state: undefined });
      return;
    }

    if (
      state?.guideId &&
      user?.clientInfo?.id &&
      state.guideId === user.clientInfo.id
    ) {
      toast.error("You cannot start a guide chat with yourself.");
      navigate(".", { replace: true, state: undefined });
      return;
    }

    if (state?.guideId && user?.clientInfo?.id) {
      createRoom({
        travellerId: user.clientInfo.id,
        guideId: state.guideId,
        guideProfileId: state.guideProfileId,
        postId: state.postId,
      })
        .then((response) => {
          setSelectedRoomId(response.room._id);
          navigate(".", { replace: true, state: undefined });
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
              "We couldn't start this chat right now."
          );
        });
      return;
    }

    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0]._id);
    }
  }, [
    location.state,
    rooms,
    selectedRoomId,
    createRoom,
    user?.clientInfo?.id,
    navigate,
  ]);

  // Join the chat room when a room is selected
  useEffect(() => {
    if (!socket || !selectedRoomId || !user?.clientInfo?.id) return;

    socket.emit(
      SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_JOIN_ROOM,
      {
        guideChatRoomId: selectedRoomId,
      },
      (response: { success: boolean; error?: string }) => {
        if (!response?.success && response?.error) {
          console.error("Failed to join room:", response.error);
        }
      }
    );
  }, [socket, selectedRoomId, user?.clientInfo?.id]);

  useEffect(() => {
    // Only travellers (clients) should emit GUIDE_SERVICE_START_CHAT
    // Guides should not emit this event as they are already participants
    if (user?.clientInfo?.role !== "client" || !socket || !selectedRoom || !user?.clientInfo?.id) return;
    
    const guideParticipant = selectedRoom.participants.find(
      (participant) => participant.role === "guide"
    );
    if (!guideParticipant) return;

    // Additional safety check: prevent self-chat even if role check somehow fails
    if (user.clientInfo.id === guideParticipant.userId) {
      console.warn("Prevented guide self-chat attempt in socket emit");
      return;
    }

    socket.emit(
      SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_START_CHAT,
      {
        travellerId: user.clientInfo.id,
        guideId: guideParticipant.userId,
        guideProfileId: selectedRoom.latestContext?.guideProfileId,
        postId: selectedRoom.latestContext?.postId,
        bookingId: selectedRoom.latestContext?.bookingId,
      },
      (response: { success: boolean; error?: string }) => {
        if (!response?.success && response?.error) {
          toast.error(response.error);
        }
      }
    );
  }, [socket, selectedRoom, user?.clientInfo?.id, user?.clientInfo?.role]);

  const [scrollToQuoteId, setScrollToQuoteId] = useState<string | null>(null);

  const handleSelectRoom = (roomId: string, quoteId?: string) => {
    setSelectedRoomId(roomId);
    if (quoteId) {
      setScrollToQuoteId(quoteId);
    }
  };

  const handleSendMessage = (
    content: string,
    onSent?: () => void,
    attachments?: GuideChatMediaAttachment[]
  ) => {
    if (!socket || !selectedRoomId || !user?.clientInfo?.id) {
      toast.error("Unable to send message at the moment.");
      return;
    }

    const senderRole = selectedRoom?.participants.find(
      (p) => p.userId === user.clientInfo.id
    )?.role || "client";

    const hasAttachments = attachments && attachments.length > 0;
    const messageType = hasAttachments
      ? attachments.length > 0 && content && content !== "[attachment]"
        ? "media"
        : "media"
      : "text";

    socket.emit(
      SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_SEND_MESSAGE,
      {
        guideChatRoomId: selectedRoomId,
        senderId: user.clientInfo.id,
        senderRole: senderRole,
        messageType: messageType,
        message: content === "[attachment]" ? undefined : content,
        mediaAttachments: hasAttachments ? attachments : undefined,
      },
      (response: { success: boolean; error?: string }) => {
        if (response?.success && onSent) {
          onSent();
        } else if (!response?.success && response?.error) {
          toast.error(response.error);
        }
      }
    );
  };

  const emptyState = (
    <div className="flex flex-1 items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Start chatting with a local guide
        </h2>
        <p className="text-slate-600 text-sm">
          Open a volunteering post and tap "Chat with guide" to plan a session,
          request availability, and share expectations.
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F5F1E8]/90 via-[#F5F1E8]/60 to-white flex overflow-hidden">
      <div className="hidden lg:flex w-[320px] border-r border-slate-200/70 flex-shrink-0">
        <GuideChatSidebar
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
          currentUserId={user?.clientInfo?.id}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {(() => {
          const guidesRooms = rooms.filter((room) => {
            const currentUserParticipant = room.participants.find(
              (p) => p.userId === user?.clientInfo?.id
            );
            return currentUserParticipant?.role === "client";
          });

          const travellersRooms = rooms.filter((room) => {
            const currentUserParticipant = room.participants.find(
              (p) => p.userId === user?.clientInfo?.id
            );
            return currentUserParticipant?.role === "guide";
          });

          const getParticipantName = (participant: typeof rooms[0]["participants"][0]): string => {
            if (participant?.firstName && participant?.lastName) {
              return `${participant.firstName} ${participant.lastName}`.trim();
            }
            return participant?.firstName || "User";
          };

          return rooms.length > 0 ? (
            <div className="lg:hidden border-b border-slate-200/60 bg-white/70 flex-shrink-0">
              <div className="px-3 py-2 space-y-2 max-h-[200px] overflow-y-auto">
                {/* Chat with Guides Section - Mobile */}
                {guidesRooms.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[10px] font-semibold text-[#8C6A3B] uppercase tracking-wide">
                      Chat with Guides
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {guidesRooms.map((room) => {
                        const otherParticipant = room.participants.find(
                          (p) => p.userId !== user?.clientInfo?.id
                        );
                        const participantName = otherParticipant
                          ? getParticipantName(otherParticipant)
                          : "Guide";

                        return (
                          <button
                            key={room._id}
                            onClick={() => handleSelectRoom(room._id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                              room._id === selectedRoomId
                                ? "bg-[#C49A6C]/90 text-white"
                                : "bg-[#F5F1E8] text-[#8C6A3B]"
                            }`}
                          >
                            {participantName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chat with Travellers Section - Mobile */}
                {travellersRooms.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[10px] font-semibold text-[#8C6A3B] uppercase tracking-wide">
                      Chat with Travellers
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {travellersRooms.map((room) => {
                        const otherParticipant = room.participants.find(
                          (p) => p.userId !== user?.clientInfo?.id
                        );
                        const participantName = otherParticipant
                          ? getParticipantName(otherParticipant)
                          : "Traveller";

                        return (
                          <button
                            key={room._id}
                            onClick={() => handleSelectRoom(room._id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                              room._id === selectedRoomId
                                ? "bg-[#C49A6C]/90 text-white"
                                : "bg-[#F5F1E8] text-[#8C6A3B]"
                            }`}
                          >
                            {participantName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null;
        })()}
        {roomsLoading ? (
          <div className="flex flex-1 items-center justify-center text-slate-500">
            Loading conversations...
          </div>
        ) : selectedRoom && selectedRoomId ? (
          <GuideChatWindow
            room={selectedRoom}
            currentUserId={user.clientInfo.id}
            initialMessages={messages}
            onSendMessage={handleSendMessage}
            isSending={messagesLoading}
            scrollToQuoteId={scrollToQuoteId}
            onQuoteScrolled={() => setScrollToQuoteId(null)}
          />
        ) : (
          emptyState
        )}
      </div>
    </div>
  );
}