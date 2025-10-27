"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GroupChatSidebar } from "@/components/group-chat/GroupChatSidebar";
import { GroupChatHeader } from "@/components/group-chat/GroupChatHeader";
import { GroupChatWindow } from "@/components/group-chat/GroupChatWindow";
import { GroupChatInput } from "@/components/group-chat/GroupChatInput";
import { useGetGroupDetails, useGetGroups } from "@/hooks/chat/useGroup-chat";
import { useGroupChat } from "@/hooks/chat/useGroupChat";
import { useClientAuth } from "@/hooks/auth/useAuth";
import type { GroupChatDetailsDto, GroupChatDo } from "@/types/group-chatType";
import { GroupDetailsView } from "@/components/group-chat/GroupDetailsView";

export default function GroupChatPage() {
  // const navigate = useNavigate();
  const { clientInfo } = useClientAuth();
  const [selectedGroup, setSelectedGroup] = useState<GroupChatDo | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [groupDetails,setGroupDetails] = useState<GroupChatDetailsDto>();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get groups data
  const { data: groupsData, isLoading: groupsLoading, error: groupsError } = useGetGroups(clientInfo?.role,searchTerm);
  const {data : groupDetailsData,isLoading : groupDetailsLoading} = useGetGroupDetails(clientInfo?.role,selectedGroup?._id!);

  // Group chat hook
  const {
    messages,
    typingUsers,
    onlineMembers,
    isLoading: chatLoading,
    error: chatError,
    messagesEndRef,
    joinGroupChat,
    leaveGroupChat,
    sendMessage,
    startTyping,
    stopTyping,
    loadMessages,
    getOnlineMembers,
  } = useGroupChat({
    groupChatId: selectedGroup?._id || null,
    enabled: !!selectedGroup,
  });
  

    const handleSearch = useCallback((searchQuery: string) => {
    setSearchTerm(searchQuery);
  }, []);

  // Handle group selection
  const handleSelectGroup = (group: GroupChatDo) => {
    if (selectedGroup?._id === group._id) return;

    // Leave current group if any
    if (selectedGroup) {
      leaveGroupChat();
    }

    setSelectedGroup(group);
    setShowSidebar(false); // Hide sidebar on mobile when group is selected
  };

  // Handle back to groups
  const handleBackToGroups = () => {
    if (selectedGroup) {
      leaveGroupChat();
      setSelectedGroup(null);
    }
    setShowSidebar(true);
  };

  useEffect(() =>{
    if(!groupDetailsData)return;
    setGroupDetails(groupDetailsData.data);
  },[groupDetailsData,selectedGroup]);

  // Join group chat when group is selected
  useEffect(() => {
    if (selectedGroup && selectedGroup.packageId) {
      joinGroupChat(selectedGroup.packageId);
    }
  }, [selectedGroup, joinGroupChat]);

  // Load online members when group is selected
  useEffect(() => {
    if (selectedGroup) {
      getOnlineMembers();
    }
  }, [selectedGroup, getOnlineMembers]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!clientInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access group chats.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="flex h-screen overflow-hidden"> {/* Added overflow-hidden */}
        {/* Sidebar - Fixed position */}
        <div className={`
          ${showSidebar ? "flex" : "hidden"} 
          md:flex 
          flex-col 
          w-full 
          md:w-80 
          lg:w-96 
          bg-white 
          border-r 
          border-gray-200
          fixed md:relative // Fixed on mobile, on desktop
          inset-y-0 left-0 // Full height, left aligned
          z-30 // Ensure sidebar is above content on mobile
          h-screen // Full viewport height
          ${selectedGroup ? "md:flex" : "flex"}
        `}>
          <GroupChatSidebar
            role={clientInfo?.role}
            selectedGroupId={selectedGroup?._id}
            onSelectGroup={handleSelectGroup}
            groups={groupsData?.data || []}
            isLoading={groupsLoading}
            error={groupsError}
            onSearch={handleSearch}
          />
        </div>

        {/* Main chat area - Takes remaining space with internal scrolling */}
        <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-0"> {/* Remove ml on desktop since sidebar is relative */}
          {selectedGroup ? (
            <div className="flex flex-col h-full"> {/* Added wrapper for full height */}
              {/* Header - Fixed height, no scroll */}
              <div className="flex-shrink-0"> {/* Prevent header from shrinking */}
                <GroupChatHeader
                  groupChat={selectedGroup}
                  onlineMembers={onlineMembers}
                  onBack={handleBackToGroups}
                  showBackButton={true}
                  onOpenDetails={()=>setIsDetailsOpen(true)}
                />
              </div>

              {/* Chat window - Scrollable area */}
              <div className="flex-1 overflow-hidden"> {/* Container for scrollable content */}
                <GroupChatWindow
                  messages={messages}
                  typingUsers={typingUsers}
                  isLoading={chatLoading}
                  error={chatError}
                  currentUserId={clientInfo.id}
                  messagesEndRef={messagesEndRef}
                  onLoadMore={() => loadMessages(20)}
                />
              </div>

              {/* Input - Fixed at bottom */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white"> {/* Prevent input from shrinking */}
                <GroupChatInput
                  onSendMessage={sendMessage}
                  onStartTyping={startTyping}
                  onStopTyping={stopTyping}
                  disabled={chatLoading}
                  placeholder={`Message ${selectedGroup.name}...`}
                />
              </div>
            </div>
          ) : (
            /* No group selected state */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <svg 
                    className="w-10 h-10 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Group Chats</h2>
                <p className="text-gray-600 mb-6">
                  Select a group from the sidebar to start chatting with your travel companions.
                </p>
                
                {/* Mobile: Show groups button */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden px-6 py-3 bg-[#5aabba] text-white rounded-lg hover:bg-[#4a9aaa] transition-colors"
                >
                  Browse Groups
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

       <GroupDetailsView
        groupDetails={groupDetails!}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isLoading={groupDetailsLoading}
      />  

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </motion.div>
  );
}