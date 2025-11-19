export interface GuideChatRoom {
  _id: string;
  roomKey: string;
  participants: Array<{
    userId: string;
    role: "client" | "guide";
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  }>;
  latestContext?: {
    guideProfileId?: string;
    postId?: string;
    bookingId?: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface GuideChatMessage {
  _id: string;
  guideChatRoomId: string;
  senderId: string;
  senderRole: "client" | "guide";
  messageType: "text" | "media" | "system" | "quote";
  message?: string;
  mediaAttachments?: Array<{
    url: string;
    publicId: string;
    type: "image" | "video" | "file" | "voice";
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnailUrl?: string;
    duration?: number;
  }>;
  deliveredTo?: string[];
  readBy?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuideChatRoomRequest {
  travellerId?: string;
  guideId: string;
  guideProfileId?: string;
  postId?: string;
  bookingId?: string;
}

export interface GuideChatRoomResponse {
  success: boolean;
  room: GuideChatRoom;
}

export interface GuideChatRoomsResponse {
  success: boolean;
  rooms: GuideChatRoom[];
}

export interface GuideChatMessagesResponse {
  success: boolean;
  messages: GuideChatMessage[];
}

export type GuideChatMediaAttachment = {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number;
};


