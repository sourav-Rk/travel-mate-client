import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGuideChatRoom,
  fetchGuideChatMessages,
  fetchGuideChatRooms,
  fetchPendingQuotes,
} from "@/services/local-guide-chat/guideChat.service";
import type {
  CreateGuideChatRoomRequest,
  GuideChatRoomResponse,
} from "@/types/guide-chat";


export const useGuideChatRooms = () => {
  return useQuery({
    queryKey: ["guide-chat", "rooms"],
    queryFn: () => fetchGuideChatRooms(),
    select: (response) => response.rooms,
    staleTime: 1000 * 30,
  });
};

export const useGuideChatMessages = (
  guideChatRoomId: string,
  limit: number = 20,
  before?: string
) => {
  return useQuery({
    queryKey: ["guide-chat", "messages", guideChatRoomId, before],
    enabled: Boolean(guideChatRoomId),
    queryFn: () => fetchGuideChatMessages(guideChatRoomId, { limit, before }),
    select: (response) => response.messages,
  });
};

export const useCreateGuideChatRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<
    GuideChatRoomResponse,
    unknown,
    CreateGuideChatRoomRequest
  >({
    mutationFn: createGuideChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide-chat", "rooms"] });
    },
  });
};

export const usePendingQuotes = () => {
  return useQuery({
    queryKey: ["guide-chat", "pending-quotes"],
    queryFn: () => fetchPendingQuotes(),
    select: (response) => response.quotes || [],
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute for countdown updates
  });
};
