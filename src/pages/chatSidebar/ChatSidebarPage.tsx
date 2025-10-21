// pages/ChatPage.tsx
"use client";

import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/chatSideBar/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useClientAuth } from "@/hooks/auth/useAuth";
import { useGetChatroom, useGetMessagesQuery } from "@/hooks/chat/useChat";
import type { Participant, ChatMessage } from "@/types/chat";
import type { ChatRoomDTO } from "@/types/chatroomType";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomData, setSelectedRoomData] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const user = useClientAuth();
  const { isConnected, socket } = useSocket();
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [chatroomData, setChatroomData] = useState<ChatRoomDTO>();

  // Fetch messages when a room is selected
  const { data: messageData, isLoading: messageLoading } = useGetMessagesQuery(
    {
      chatroomId: selectedRoomId || "",
      limit: 20,
      before: undefined,
      role: user.clientInfo.role,
    },
    { enabled: !!selectedRoomId && !initialLoadComplete }
  );

  const { data: chatroomDetails } = useGetChatroom({
    chatroomId: selectedRoomId || "",
    role: "client",
  },{
    enabled : !!selectedRoomId 
  });

  // Handle room selection
  const handleSelectRoom = (roomId: string) => {
    console.log("🎯 Selecting room:", roomId);
    setSelectedRoomId(roomId);
    setInitialLoadComplete(false);
    setMessages([]);
    setHasMore(true);
    // In a real app, you'd fetch room data here
    // For now, we'll use mock data
    setSelectedRoomData({
      roomId,
      peer: {
        id: chatroomData?.participants.filter(x => x.userId!== user.clientInfo.id),
        name: "Other User",
        type: chatroomData?.participants.filter(x => x.userType !== user.clientInfo.role),
        online: true,
      },
    });
  };

  // Handle initial messages load
  useEffect(() => {
    if (!messageData?.data || initialLoadComplete || !selectedRoomId) return;

    console.log("📥 Initial messages loaded:", messageData.data.length);
    setMessages(messageData.data);
    setInitialLoadComplete(true);

    if (messageData.data.length < 20) {
      setHasMore(false);
    }
  }, [messageData, initialLoadComplete, selectedRoomId]);

  useEffect(() => {
    if (!chatroomData) return;
    setChatroomData(chatroomDetails?.data);
  }, [chatroomDetails]);

  // Handle new messages from socket
  useEffect(() => {
    if (!socket || !selectedRoomId) return;

    console.log("🎯 Setting up new_message listener for room:", selectedRoomId);

    const handleNewMessage = (msg: any) => {
      // Only handle messages for the selected room
      if (msg.chatRoomId !== selectedRoomId) return;

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
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, selectedRoomId]);

  // Load more messages for pagination
  const handleLoadMore = async (before: string): Promise<ChatMessage[]> => {
    if (!selectedRoomId || !hasMore) return [];

    try {
      // You'll need to implement this function to fetch older messages
      // const response = await getMoreMessages(selectedRoomId, before);
      // return response.data;
      return [];
    } catch (error) {
      console.error("Error loading more messages:", error);
      return [];
    }
  };

  // Define participants
  const currentUser: Participant = {
    id: user.clientInfo.id,
    type: user.clientInfo.role,
    name: user.clientInfo.firstName,
    avatarUrl: user.clientInfo?.profileImage,
    online: true,
  };

  const otherUser: Participant = selectedRoomData?.peer || {
    id: chatroomData?.participants.filter(x => x.userId !== user.clientInfo.id)[0],
    type: chatroomData?.participants.filter(x => x.userType !== user.clientInfo.role)[0],
    name: "Select a conversation",
    online: false,
  };

  // Check if mobile view (you might want to use a hook for this)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle back to sidebar on mobile
  const handleBackToSidebar = () => {
    setSelectedRoomId(null);
    setSelectedRoomData(null);
  };

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      {/* Sidebar - Always visible on desktop, conditional on mobile */}
      <div
        className={`
        ${isMobile && selectedRoomId ? "hidden" : "flex"} 
        md:flex md:w-80 lg:w-96 flex-shrink-0
      `}
      >
        <ChatSidebar
          role={user.clientInfo.role}
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
          className="w-full h-full border-r border-gray-200 bg-white"
        />
      </div>

      {/* Chat Window - Takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedRoomId ? (
          <>
            {/* Mobile header with back button */}
            {isMobile && (
              <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-gray-200 bg-white md:hidden">
                <button
                  onClick={handleBackToSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back to conversations"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white font-semibold text-xs">
                    {otherUser.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {otherUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {otherUser.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Window */}
            <ChatWindow
              self={currentUser}
              other={otherUser}
              chatRoomId={selectedRoomId}
              contextType={chatroomData?.contextType!}
              contextId={chatroomData?.contextId!}
              initialMessages={messages}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showHeader={!isMobile} // Hide header on mobile since we have our own
              className={isMobile ? "pt-0" : ""}
            />
          </>
        ) : (
          // Empty state when no chat is selected
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5aabba]/10 to-[#4a9aaa]/10 flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-12 h-12 text-[#5aabba]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 mb-6">
                Choose a chat from the sidebar to start messaging or start a new
                conversation.
              </p>
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span>Send messages in real-time</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>See when messages are read</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Fast and responsive</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
