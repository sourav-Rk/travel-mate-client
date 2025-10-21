// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { ChatListItem } from "./ChatListItem";
// import { useGetChatHistory } from "@/hooks/chat/useChat";
// import type { ChatListItemDTO } from "@/types/chat";


// export interface ChatSidebarProps {
//   role: "client" | "guide" | "vendor";
//   selectedRoomId?: string;
//   onSelectRoom?: (roomId: string) => void;
//   className?: string;
// }

// export function ChatSidebar({
//   role,
//   selectedRoomId,
//   onSelectRoom,
//   className,
// }: ChatSidebarProps) {
//   const [query, setQuery] = useState("");
//   const [chatlistItem, setChatListItems] = useState<ChatListItemDTO[]>([]);
//   const { data, isLoading } = useGetChatHistory({
//     page: 1,
//     limit: 20,
//     role: role,
//     searchTerm: query,
//   });

//   useEffect(() => {
//     if (!data?.data) return;
//     setChatListItems(data.data);
//   });

//   const items = chatlistItem ?? [];
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter((i) => i.peerInfo.firstName.toLowerCase().includes(q));
//   }, [items, query]);

//   return (
//     <aside
//       className={cn(
//         "relative md:fixed md:inset-y-0 md:left-0 z-30 w-full md:w-[var(--chat-sidebar-width)]",
//         "border-r border-[var(--color-chat-border)] bg-[var(--color-chat-sidebar-bg)]",
//         "text-[var(--color-chat-text-primary)] flex flex-col",
//         className
//       )}
//       role="complementary"
//       aria-label="Chat sidebar"
//     >
//       <div className="px-3 pb-3 pt-4">
//         <div className="px-1">
//           <label htmlFor="chat-search" className="sr-only">
//             Search users
//           </label>
//           <Input
//             id="chat-search"
//             placeholder="Search users"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="border-[var(--color-chat-border)] text-[var(--color-chat-text-primary)] placeholder:text-[var(--color-chat-text-secondary)]"
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto px-2 pb-4">
//         {isLoading ? (
//           <div className="px-2 text-sm text-muted-foreground">
//             Loading conversations…
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="px-2 text-sm text-muted-foreground">
//             No conversations
//           </div>
//         ) : (
//           <ul className="space-y-1">
//             {filtered.map((item) => (
//               <li key={item.roomId}>
//                 <ChatListItem
//                   item={item}
//                   active={item.roomId === selectedRoomId}
//                   onClick={() => onSelectRoom?.(item.roomId)}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </aside>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { ChatListItem } from "./ChatListItem";
// import { useGetChatHistory } from "@/hooks/chat/useChat";
// import type { ChatListItemDTO } from "@/types/chat";

// export interface ChatSidebarProps {
//   role: "client" | "guide" | "vendor";
//   selectedRoomId?: string;
//   onSelectRoom?: (roomId: string) => void;
//   className?: string;
// }

// export function ChatSidebar({
//   role,
//   selectedRoomId,
//   onSelectRoom,
//   className,
// }: ChatSidebarProps) {
//   const [query, setQuery] = useState("");
//   const [chatlistItem, setChatListItems] = useState<ChatListItemDTO[]>([]);
//   const { data, isLoading } = useGetChatHistory({
//     page: 1,
//     limit: 20,
//     role: role,
//     searchTerm: query,
//   });

//   useEffect(() => {
//     if (!data?.data) return;
//     setChatListItems(data.data);
//   }, [data]);

//   const items = chatlistItem ?? [];
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter((i) => i.peerInfo.firstName.toLowerCase().includes(q));
//   }, [items, query]);

//   return (
//     <aside
//       className={cn(
//         "flex flex-col h-full bg-white border-r border-gray-200",
//         className
//       )}
//       role="complementary"
//       aria-label="Chat sidebar"
//     >
//       {/* Header Section */}
//       <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 bg-white">
//         <h2 className="text-xl font-bold text-[#333333] mb-4">Messages</h2>
        
//         {/* Search Input */}
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//           <Input
//             id="chat-search"
//             placeholder="Search conversations..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="pl-10 pr-4 py-2.5 w-full border-gray-300 rounded-lg focus:ring-[#5aabba] focus:border-[#5aabba] text-sm"
//           />
//         </div>
//       </div>

//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto px-3 py-2">
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center h-32 text-center">
//             <div className="w-8 h-8 border-3 border-[#5aabba] border-t-transparent rounded-full animate-spin mb-3"></div>
//             <p className="text-sm text-gray-500">Loading conversations...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-32 text-center px-4">
//             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//               </svg>
//             </div>
//             <p className="text-sm font-medium text-gray-900 mb-1">No conversations</p>
//             <p className="text-xs text-gray-500">
//               {query ? "No results found" : "Start chatting to see your messages here"}
//             </p>
//           </div>
//         ) : (
//           <ul className="space-y-1">
//             {filtered.map((item) => (
//               <li key={item.roomId}>
//                 <ChatListItem
//                   item={item}
//                   active={item.roomId === selectedRoomId}
//                   onClick={() => onSelectRoom?.(item.roomId)}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Footer - User Info */}
//       <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
//             {role[0].toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-[#333333] truncate capitalize">
//               {role}
//             </p>
//             <p className="text-xs text-gray-500">Active now</p>
//           </div>
//           <button 
//             className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//             aria-label="Settings"
//           >
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }

// components/chat/chatSideBar/ChatSidebar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatListItem } from "./ChatListItem";
import { useGetChatHistory } from "@/hooks/chat/useChat";
import type { ChatListItemDTO } from "@/types/chat";

export interface ChatSidebarProps {
  role: "client" | "guide" | "vendor";
  selectedRoomId?: string | null;
  onSelectRoom?: (roomId: string) => void;
  className?: string;
}

export function ChatSidebar({
  role,
  selectedRoomId,
  onSelectRoom,
  className,
}: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const [chatlistItem, setChatListItems] = useState<ChatListItemDTO[]>([]);
  
  const { data, isLoading, error } = useGetChatHistory({
    page: 1,
    limit: 50,
    role: role,
    searchTerm: query,
  });

  useEffect(() => {
    if (!data?.data) return;
    setChatListItems(data.data);
  }, [data]);

  const items = chatlistItem ?? [];
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => 
      i.peerInfo.firstName.toLowerCase().includes(q) 
    );
  }, [items, query]);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200",
        className
      )}
      role="complementary"
      aria-label="Chat sidebar"
    >
      {/* Header Section */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-[#333333] mb-4">Messages</h2>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            id="chat-search"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border-gray-300 rounded-lg focus:ring-[#5aabba] focus:border-[#5aabba] text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-8 h-8 border-3 border-[#5aabba] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Error loading conversations</p>
            <p className="text-xs text-gray-500">Please try again later</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No conversations</p>
            <p className="text-xs text-gray-500">
              {query ? "No results found" : "Start chatting to see your messages here"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <li key={item.roomId}>
                <ChatListItem
                  item={item}
                  active={item.roomId === selectedRoomId}
                  onClick={() => onSelectRoom?.(item.roomId)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer - User Info */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {role[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#333333] truncate capitalize">
              {role}
            </p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>
      </div>
    </aside>
  );
}