import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getNotificationsGuide,
  markNotificationReadGuide,
  markAllNotificationReadGuide,
} from "@/services/guide/guide.service";
import type { IGetAllNotificationsGuideResponse } from "@/types/api/guide";
import type { IResponse } from "@/types/Response";

export const useGuideNotificationsQuery = () => {
  return useQuery<IGetAllNotificationsGuideResponse>({
    queryKey: ["notifications-guide"],
    queryFn: getNotificationsGuide,
  });
};

export const useMarkNotificationReadGuide = () => {
  const queryClient = useQueryClient();
  return useMutation<IResponse, AxiosError, string>({
    mutationFn: markNotificationReadGuide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-guide"] });
    },
  });
};

export const useMarkAllNotificationsReadGuide = () => {
  const queryClient = useQueryClient();
  return useMutation<IResponse, AxiosError, void>({
    mutationFn: markAllNotificationReadGuide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-guide"] });
    },
  });
};


