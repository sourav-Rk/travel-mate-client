import { server } from "../server";
import type {
  CreateGuideChatRoomRequest,
  GuideChatRoomResponse,
  GuideChatRoomsResponse,
  GuideChatMessagesResponse,
} from "@/types/guide-chat";
import type { Quote } from "@/types/local-guide-booking";

const BASE_URL = "/client/guide-chat";

export const createGuideChatRoom = async (
  payload: CreateGuideChatRoomRequest
): Promise<GuideChatRoomResponse> => {
  return server.post<GuideChatRoomResponse, CreateGuideChatRoomRequest>(
    BASE_URL,
    payload
  );
};

export const fetchGuideChatRooms = async (): Promise<GuideChatRoomsResponse> => {
  return server.get<GuideChatRoomsResponse>(`${BASE_URL}/rooms`);
};

export const fetchGuideChatMessages = async (
  guideChatRoomId: string,
  params?: { limit?: number; before?: string }
): Promise<GuideChatMessagesResponse> => {
  return server.get<GuideChatMessagesResponse>(
    `${BASE_URL}/messages/${guideChatRoomId}`,
    {
      params,
    }
  );
};

export const fetchPendingQuotes = async (): Promise<{
  success: boolean;
  quotes: Quote[];
}> => {
  return server.get<{ success: boolean; quotes: Quote[] }>(
    `${BASE_URL}/quotes/pending`
  );
};



