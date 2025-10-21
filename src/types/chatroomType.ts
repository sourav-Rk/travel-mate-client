import type { ResponseWithData } from "./common";

export interface ChatRoomDTO {
  _id: string;
  participants: Participants[];
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Participants = {
  userId: string;
  userType: "client" | "guide" | "vendor";
};

export type IGetChatroomResponseDto = ResponseWithData<ChatRoomDTO>;