import qs from "qs";
import { server } from "@/services/server";
import type {
  IGetGroupDetailsResponse,
  IGetGroupsResponse,
  IGetMessagesResponse,
} from "@/types/api/client";
import { CLIENT_API } from "@/constants/api/client.api";
import { GUIDE_API } from "@/constants/api/guide.api";
import type { IPaginatedChatHistoryResponseDto } from "@/types/chat";
import type { IGetChatroomResponseDto } from "@/types/chatroomType";
import { VENDOR_API } from "@/constants/api/vendor.api";

type GetMessagesParams = {
  chatroomId: string;
  limit?: number;
  before?: string;
  role: "client" | "guide" | "vendor";
};

export const getMessages = async ({
  chatroomId,
  limit = 20,
  before,
  role,
}: GetMessagesParams) => {
  let endpoint: string;

  switch (role) {
    case "client":
      endpoint = CLIENT_API.GET_MESSAGES_CLIENT;
      break;

    case "guide":
      endpoint = GUIDE_API.GET_MESSAGES;
      break;

    case "vendor":
      endpoint = VENDOR_API.GET_MESSAGES;
      break;

    default:
      throw new Error(`Invalid role provided: ${role}`);
  }

  return server.get<IGetMessagesResponse>(endpoint, {
    params: { chatroomId, limit, before },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
};

type GetHistoryParams = {
  page: number;
  limit: number;
  searchTerm?: string;
  role: "client" | "guide" | "vendor";
};

export const getChatHistory = async ({
  page = 1,
  limit = 20,
  searchTerm,
  role,
}: GetHistoryParams) => {
  let endpoint: string;

  switch (role) {
    case "client":
      endpoint = CLIENT_API.GET_CHAT_HISTORY;
      break;
    case "guide":
      endpoint = GUIDE_API.GET_CHAT_HISTORY;
      break;
    case "vendor":
      endpoint = VENDOR_API.GET_CHAT_HISTORY;
      break;
    default:
      throw new Error(`Invalid role provided: ${role}`);
  }
  return server.get<IPaginatedChatHistoryResponseDto>(endpoint, {
    params: { page, limit, searchTerm },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
};

type GetChatroomParams = {
  chatroomId: string;
  role: "client" | "guide" | "vendor";
};

export const getChatroom = async ({ chatroomId, role }: GetChatroomParams) => {
  let endpoint: string;

  switch (role) {
    case "client":
      endpoint = CLIENT_API.GET_CHATROOM(chatroomId);
      break;
    case "guide":
      endpoint = GUIDE_API.GET_CHATROOM(chatroomId);
      break;
    case "vendor":
      endpoint = GUIDE_API.GET_CHATROOM(chatroomId);
      break;
    default:
      throw new Error(`Invalid role provided: ${role}`);
  }
  return server.get<IGetChatroomResponseDto>(endpoint, {});
};

//group chat services

export const getGroups = async ({
  role,
  searchTerm
}: {
  role: "client" | "vendor" | "guide";
  searchTerm?: string;
}) => {
  let endpoint: string;

  switch (role) {
    case "client":
      endpoint = CLIENT_API.GET_GROUPS;
      break;

    case "guide":
      endpoint = GUIDE_API.GET_GROUPS;
      break;

    case "vendor":
      endpoint = VENDOR_API.GET_GROUPS;
      break;

    default:
      throw new Error(`Invalid role provided: ${role}`);
  }

  return server.get<IGetGroupsResponse>(endpoint, {
    params:{
      searchTerm
    }
  });
};

export const getGroupDetails = async ({
  groupId,
  role,
}: {
  groupId: string;
  role: "client" | "vendor" | "guide";
}) => {
  let endpoint: string;

  switch (role) {
    case "client":
      endpoint = CLIENT_API.GET_GROUP_DETAILS(groupId);
      break;

    case "guide":
      endpoint = GUIDE_API.GET_GROUP_DETAILS(groupId);
      break;

    case "vendor":
      endpoint = VENDOR_API.GET_GROUP_DETAILS(groupId);
      break;

    default:
      throw new Error(`Invalid role provided: ${role}`);
  }

  return server.get<IGetGroupDetailsResponse>(endpoint, {});
};
