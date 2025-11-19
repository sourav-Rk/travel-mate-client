import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { GuideChatRoom } from "@/types/guide-chat";
import type { Quote } from "@/types/local-guide-booking";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Users, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePendingQuotes } from "@/hooks/guide-chat/useGuideChat";
import { PendingQuotesSection } from "./PendingQuotesSection";

interface GuideChatSidebarProps {
  rooms: GuideChatRoom[];
  selectedRoomId?: string | null;
  onSelectRoom: (roomId: string, quoteId?: string) => void;
  currentUserId?: string;
}

const gradientBg = "bg-gradient-to-b from-[#F5F1E8] via-[#F5F1E8]/70 to-white";

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

const getOtherParticipant = (
  room: GuideChatRoom,
  currentUserId?: string
): GuideChatRoom["participants"][0] | undefined => {
  if (!currentUserId) {
    return room.participants.find((p) => p.role === "guide") || room.participants[0];
  }
  return room.participants.find((p) => p.userId !== currentUserId);
};

const getCurrentUserRole = (
  room: GuideChatRoom,
  currentUserId?: string
): "client" | "guide" | undefined => {
  if (!currentUserId) return undefined;
  const currentUserParticipant = room.participants.find((p) => p.userId === currentUserId);
  return currentUserParticipant?.role;
};

interface GroupedRooms {
  guides: GuideChatRoom[];
  travellers: GuideChatRoom[];
}

export function GuideChatSidebar({
  rooms,
  selectedRoomId,
  onSelectRoom,
  currentUserId,
}: GuideChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    guides: true,
    travellers: true,
  });
  const navigate = useNavigate();
  const { data: pendingQuotes = [] } = usePendingQuotes();

  // Get pending quotes count per room for badges
  const pendingQuotesByRoom = useMemo(() => {
    const map = new Map<string, number>();
    pendingQuotes.forEach((quote) => {
      const count = map.get(quote.guideChatRoomId) || 0;
      map.set(quote.guideChatRoomId, count + 1);
    });
    return map;
  }, [pendingQuotes]);

  const handleSelectQuote = (quote: Quote) => {
    onSelectRoom(quote.guideChatRoomId, quote.quoteId);
  };

  // Auto-expand section if it contains the selected room
  useEffect(() => {
    if (selectedRoomId) {
      const selectedRoom = rooms.find((room) => room._id === selectedRoomId);
      if (selectedRoom) {
        const currentUserRole = getCurrentUserRole(selectedRoom, currentUserId);
        if (currentUserRole === "client") {
          setExpandedSections((prev) => (prev.guides ? prev : { ...prev, guides: true }));
        } else if (currentUserRole === "guide") {
          setExpandedSections((prev) => (prev.travellers ? prev : { ...prev, travellers: true }));
        }
      }
    }
  }, [selectedRoomId, rooms, currentUserId]);

  const toggleSection = (section: "guides" | "travellers") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const groupedRooms = useMemo((): GroupedRooms => {
    const guides: GuideChatRoom[] = [];
    const travellers: GuideChatRoom[] = [];

    rooms.forEach((room) => {
      const currentUserRole = getCurrentUserRole(room, currentUserId);
      if (currentUserRole === "client") {
        // Current user is traveller, so they're chatting with a guide
        guides.push(room);
      } else if (currentUserRole === "guide") {
        // Current user is guide, so they're chatting with a traveller
        travellers.push(room);
      }
    });

    // Sort by most recent activity (lastMessageAt)
    const sortByRecent = (a: GuideChatRoom, b: GuideChatRoom) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    };

    guides.sort(sortByRecent);
    travellers.sort(sortByRecent);

    return { guides, travellers };
  }, [rooms, currentUserId]);

  const filteredGroupedRooms = useMemo((): GroupedRooms => {
    if (!search.trim()) {
      return groupedRooms;
    }

    const searchLower = search.toLowerCase();
    const filterRooms = (roomList: GuideChatRoom[]) => {
      return roomList.filter((room) => {
        const otherParticipant = getOtherParticipant(room, currentUserId);
        if (!otherParticipant) return false;
        const participantName = getParticipantName(otherParticipant);
        return participantName.toLowerCase().includes(searchLower);
      });
    };

    return {
      guides: filterRooms(groupedRooms.guides),
      travellers: filterRooms(groupedRooms.travellers),
    };
  }, [groupedRooms, search, currentUserId]);

  return (
    <aside
      className={cn(
        "w-full h-full flex flex-col border-r border-slate-200/60",
        gradientBg
      )}
    >
      <div className="flex-shrink-0 p-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/volunteering")}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Back to volunteering"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
            {pendingQuotes.length > 0 && (
              <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                {pendingQuotes.length}
              </span>
            )}
          </div>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations"
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm focus:border-[#C49A6C] focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Pending Quotes Section - Only show for travellers (clients) */}
        {currentUserId && pendingQuotes.length > 0 && (
          <PendingQuotesSection
            quotes={pendingQuotes}
            onSelectQuote={handleSelectQuote}
            currentUserId={currentUserId}
          />
        )}

        {filteredGroupedRooms.guides.length === 0 &&
        filteredGroupedRooms.travellers.length === 0 ? (
          <div className="text-center text-slate-500 text-sm px-4 py-8">
            {search.trim() ? "No conversations found." : "No conversations yet."}
          </div>
        ) : (
          <div className="px-2 py-3 space-y-4">
            {/* Chat with Guides Section */}
            {filteredGroupedRooms.guides.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("guides")}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-white/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8C6A3B]" />
                    <h3 className="text-xs font-semibold text-[#8C6A3B] uppercase tracking-wide">
                      Chat with Guides ({filteredGroupedRooms.guides.length})
                    </h3>
                  </div>
                  {expandedSections.guides ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6A3B] transition-transform group-hover:scale-110" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C6A3B] transition-transform group-hover:scale-110" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {expandedSections.guides && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-1">
                        {filteredGroupedRooms.guides.map((room) => {
                  const isActive = room._id === selectedRoomId;
                  const lastMessageTime = room.lastMessageAt
                    ? formatDistanceToNow(new Date(room.lastMessageAt), {
                        addSuffix: true,
                      })
                    : "New chat";

                  const otherParticipant = getOtherParticipant(room, currentUserId);
                  const participantName = otherParticipant
                    ? getParticipantName(otherParticipant)
                    : "Unknown User";

                  return (
                    <button
                      key={room._id}
                      onClick={() => onSelectRoom(room._id)}
                      className={cn(
                        "w-full rounded-2xl p-3 text-left transition-all",
                        isActive
                          ? "bg-white shadow-md border border-[#E3D5C5]"
                          : "hover:bg-white/70"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {otherParticipant?.profileImage ? (
                          <img
                            src={otherParticipant.profileImage}
                            alt={participantName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {participantName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="font-semibold text-sm text-slate-900 truncate">
                                {participantName}
                              </div>
                              {pendingQuotesByRoom.get(room._id) && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-yellow-500 text-white text-[10px] font-semibold flex-shrink-0">
                                  {pendingQuotesByRoom.get(room._id)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                              {lastMessageTime}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                            {room.lastMessage ?? "Introduce yourself and plan a session."}
                          </p>
                          {room.latestContext?.postId && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#F0E6D8] px-2 py-0.5 text-[10px] font-medium text-[#8C6A3B]">
                              Post #{room.latestContext.postId.slice(-4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Chat with Travellers Section */}
            {filteredGroupedRooms.travellers.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection("travellers")}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-white/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8C6A3B]" />
                    <h3 className="text-xs font-semibold text-[#8C6A3B] uppercase tracking-wide">
                      Chat with Travellers ({filteredGroupedRooms.travellers.length})
                    </h3>
                  </div>
                  {expandedSections.travellers ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6A3B] transition-transform group-hover:scale-110" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C6A3B] transition-transform group-hover:scale-110" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {expandedSections.travellers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-1">
                        {filteredGroupedRooms.travellers.map((room) => {
                  const isActive = room._id === selectedRoomId;
                  const lastMessageTime = room.lastMessageAt
                    ? formatDistanceToNow(new Date(room.lastMessageAt), {
                        addSuffix: true,
                      })
                    : "New chat";

                  const otherParticipant = getOtherParticipant(room, currentUserId);
                  const participantName = otherParticipant
                    ? getParticipantName(otherParticipant)
                    : "Unknown User";

                  return (
                    <button
                      key={room._id}
                      onClick={() => onSelectRoom(room._id)}
                      className={cn(
                        "w-full rounded-2xl p-3 text-left transition-all",
                        isActive
                          ? "bg-white shadow-md border border-[#E3D5C5]"
                          : "hover:bg-white/70"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {otherParticipant?.profileImage ? (
                          <img
                            src={otherParticipant.profileImage}
                            alt={participantName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C49A6C] to-[#8C6A3B] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {participantName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="font-semibold text-sm text-slate-900 truncate">
                                {participantName}
                              </div>
                              {pendingQuotesByRoom.get(room._id) && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-yellow-500 text-white text-[10px] font-semibold flex-shrink-0">
                                  {pendingQuotesByRoom.get(room._id)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                              {lastMessageTime}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                            {room.lastMessage ?? "Introduce yourself and plan a session."}
                          </p>
                          {room.latestContext?.postId && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#F0E6D8] px-2 py-0.5 text-[10px] font-medium text-[#8C6A3B]">
                              Post #{room.latestContext.postId.slice(-4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}