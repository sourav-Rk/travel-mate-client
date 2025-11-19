export const SOCKET_EVENTS = {
  CLIENT: {
    GUIDE_SERVICE_START_CHAT: "guide_service_start_chat",
    GUIDE_SERVICE_JOIN_ROOM: "guide_service_join_room",
    GUIDE_SERVICE_SEND_MESSAGE: "guide_service_send_message",
    GUIDE_SERVICE_MARK_DELIVERED: "guide_service_mark_delivered",
    GUIDE_SERVICE_MARK_READ: "guide_service_mark_read",
    GUIDE_SERVICE_CREATE_QUOTE: "guide_service_create_quote",
    GUIDE_SERVICE_ACCEPT_QUOTE: "guide_service_accept_quote",
    GUIDE_SERVICE_DECLINE_QUOTE: "guide_service_decline_quote",
  },
  SERVER: {
    GUIDE_SERVICE_CHAT_READY: "guide_service_chat_ready",
    GUIDE_SERVICE_NEW_MESSAGE: "guide_service_new_message",
    GUIDE_SERVICE_MESSAGES_DELIVERED: "guide_service_messages_delivered",
    GUIDE_SERVICE_MESSAGES_READ: "guide_service_messages_read",
    GUIDE_SERVICE_QUOTE_CREATED: "guide_service_quote_created",
    GUIDE_SERVICE_QUOTE_ACCEPTED: "guide_service_quote_accepted",
    GUIDE_SERVICE_QUOTE_DECLINED: "guide_service_quote_declined",
  },
} as const;


