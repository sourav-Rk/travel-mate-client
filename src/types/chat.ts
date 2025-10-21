import type { PaginatedResponseData, ResponseWithData } from "./common"

export type ParticipantType = "client" | "guide" | "vendor"

export type ContextType = "guide_client" | "client_client" | "vendor_client"

export type Participant = {
  id: string
  type: ParticipantType
  name: string
  avatarUrl?: string
  online?: boolean
}

export type ChatMessage = {
   _id: string;
  message: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  status: "sent" | "delivered" | "read" | "failed";
  createdAt: string;
  readAt?: string;
  deliveredTo?: string[];
  chatRoomId?: string;
}


export type SendMessagePayload = {
  chatRoomId: string
  senderId: string
  senderType: ParticipantType
  receiverId: string
  receiverType: ParticipantType
  message: string
  contextType: ContextType
  contextId: string
}



export interface PeerDTO {
  userId: string;
  userType: "client" | "guide" | "vendor";
}

export interface PeerInfoDTO {
  firstName: string;
  profileImage?: string; 
}

export interface ChatListItemDTO {
  roomId: string;
  peer: PeerDTO;
  peerInfo: PeerInfoDTO;
  lastMessage?: string;
  lastMessageStatus?: "sent" | "delivered" | "read";
  lastMessageReadAt?: string; 
  lastMessageAt?: string; 
}

export type IPaginatedChatHistoryResponseDto = PaginatedResponseData<ChatListItemDTO>