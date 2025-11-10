import type { PaginatedResponseData } from "./common";

export type ParticipantType = "client" | "guide" | "vendor";

export type ContextType = "guide_client" | "client_client" | "vendor_client";

export type Participant = {
  id: string;
  type: ParticipantType;
  name: string;
  avatarUrl?: string;
  online?: boolean;
};

export type MediaAttachment = {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number;
};

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
  mediaAttachments?: MediaAttachment[];
  messageType?: "text" | "media" | "mixed";
};

export type SendMessagePayload = {
  chatRoomId: string;
  senderId: string;
  senderType: ParticipantType;
  receiverId: string;
  receiverType: ParticipantType;
  message: string;
  mediaAttachments?: MediaAttachment[];
  contextType: ContextType;
  contextId: string;
};

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
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  lastMessage?: string;
  lastMessageStatus?: "sent" | "delivered" | "read";
  lastMessageReadAt?: string;
  lastMessageAt?: string;
}

export type IPaginatedChatHistoryResponseDto =
  PaginatedResponseData<ChatListItemDTO>;
