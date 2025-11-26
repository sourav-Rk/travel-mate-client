"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { GroupChatDo } from "@/types/group-chatType";
import { GroupChatListItem } from "./GroupChatListItem";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export interface GroupChatSidebarProps {
  role: "client" | "guide" | "vendor";
  selectedGroupId?: string | null;
  onSelectGroup?: (group: GroupChatDo) => void;
  className?: string;
  groups?: GroupChatDo[];
  isLoading?: boolean;
  error?: Error | null;
  onSearch?: (searchTerm: string) => void;
}

export function GroupChatSidebar({
  selectedGroupId,
  onSelectGroup,
  className,
  groups = [],
  isLoading = false,
  error = null,
  onSearch,
}: GroupChatSidebarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      _.debounce((searchQuery: string) => {
        onSearch?.(searchQuery); 
      }, 500),
    [onSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleGroupSelect = (group: GroupChatDo) => {
    onSelectGroup?.(group);
  };

  const handleBackToProfile = () => {
    navigate(-1);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200",
        className
      )}
      role="complementary"
      aria-label="Group chat sidebar"
    >
      {/* Header Section */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white">
        {/* Back Button and Title Row */}
        <div className="flex items-center gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
          {/* Back Button */}
          <button
            onClick={handleBackToProfile}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#5aabba] focus:ring-offset-1"
            aria-label="Back to profile"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors" 
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
          
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-[#333333]">
            Group Chats
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            id="group-search"
            placeholder="Search groups..."
            value={query}
            onChange={handleSearch}
            className="pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 w-full border-gray-300 rounded-lg focus:ring-[#5aabba] focus:border-[#5aabba] text-sm"
          />
        </div>
      </div>

      {/* Group Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-8 h-8 border-3 border-[#5aabba] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading groups...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Error loading groups
            </p>
            <p className="text-xs text-gray-500">Please try again later</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <p className="text-sm font-medium text-gray-900 mb-1">
              No group chats
            </p>
            <p className="text-xs text-gray-500">
              {query ? "No results found" : "Join a package to see group chats"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {groups.map((group) => (
              <li key={group._id}>
                <GroupChatListItem
                  group={group}
                  active={group._id === selectedGroupId}
                  onClick={() => handleGroupSelect(group)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
