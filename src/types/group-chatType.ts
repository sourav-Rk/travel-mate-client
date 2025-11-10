export interface GroupChatDo {
  _id: string;
  packageId: string;
  name: string;
  members: {
    userId: string;
    userType: "client" | "guide" | "vendor";
  }[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAttachment {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface GroupMessage {
  _id: string;
  groupChatId: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  senderName : string;
  message: string;
  mediaAttachments?: MediaAttachment[];
  messageType?: "text" | "media" | "mixed";
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingUser {
  userId: string;
  userType: "client" | "guide" | "vendor";
  timestamp: Date;
}

export interface GroupChatState {
  messages: GroupMessage[];
  typingUsers: TypingUser[];
  onlineMembers: string[];
  isLoading: boolean;
  error: string | null;
}


export interface GroupChatDetailsDto {
  _id: string;
  packageId: string;
  name: string;
  memberDetails: MemberDetailDto[];
  membersCount: number;
  createdAt: Date;
}


export interface MemberDetailDto {
  userId: string;
  userType: "client" | "guide" | "vendor";
  name: string;
  avatar?: string;
}