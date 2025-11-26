import type { ChatMessage, MediaAttachment } from "./chat";

export interface SocketResponse {
  success: boolean;
  message?: ChatMessage;
  messageIds?: string[];
  readAt?: string;
}

export interface TypingEventData {
  userId: string;
}

export interface MessageEventData {
  _id: string;
  message?: string;
  senderId: string;
  senderType: string;
  status?: string;
  createdAt: string;
  readAt?: string;
  deliveredTo?: string[];
  mediaAttachments?: MediaAttachment[];
  messageType?: string;
}

export interface DeliveryEventData {
  userId: string;
  messageIds: string[];
}

export interface ReadEventData {
  userId: string;
  messageIds: string[];
  readAt?: string;
}
