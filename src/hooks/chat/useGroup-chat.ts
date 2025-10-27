import { getGroupDetails, getGroups } from "@/services/chat/chat.service";
import { useQuery } from "@tanstack/react-query";

export const useGetGroups = (role: "client" | "vendor" | "guide",searchTerm?:string) => {
  return useQuery({
    queryKey: ["group-chats",searchTerm],
    queryFn: () => getGroups({ role,searchTerm }),
  });
};

export const useGetGroupDetails = (
  role: "client" | "vendor" | "guide",
  groupId: string
) => {
  return useQuery({
    queryKey: ["group-details"],
    queryFn: () => getGroupDetails({ groupId, role }),
    enabled: !!groupId,
  });
};
