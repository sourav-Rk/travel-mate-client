import { useQuery } from "@tanstack/react-query";
import {
  getChatHistory,
  getChatroom,
  getMessages,
} from "@/services/chat/chat.service";
import type { IGetMessagesResponse } from "@/types/api/client";
import type { IPaginatedChatHistoryResponseDto } from "@/types/chat";

type FetchMessagesParams = {
  chatroomId: string;
  limit?: number;
  before?: string;
  role: "client" | "guide" | "vendor";
};

type UseGetMessagesQueryOptions = {
  enabled?: boolean;
};

type FetchChatHistoryParams = {
  page: number;
  limit: number;
  searchTerm?: string;
  role: "client" | "guide" | "vendor";
};

type FetchChatRoomParams = {
  chatroomId: string;
  role: "client" | "guide" | "vendor";
};

export const useGetMessagesQuery = (
  params: FetchMessagesParams,
  options?: UseGetMessagesQueryOptions
) => {
  return useQuery<IGetMessagesResponse>({
    queryKey: ["messages", params.chatroomId],
    queryFn: () => getMessages(params),
    enabled: options?.enabled ?? !!params.chatroomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

//get message history
export const useGetChatHistory = (params: FetchChatHistoryParams) => {
  return useQuery<IPaginatedChatHistoryResponseDto>({
    queryKey: [
      "chat-history",
      params.limit,
      params.role,
      params.role,
      params.searchTerm,
    ],
    queryFn: () => getChatHistory(params),
  });
};

//get chatroom
export const useGetChatroom = (params: FetchChatRoomParams,options?: UseGetMessagesQueryOptions) => {
  return useQuery({
    queryKey: ["chatroom", params.chatroomId],
    queryFn: () => getChatroom(params),
    enabled: options?.enabled ?? !!params.chatroomId,
  });
};
