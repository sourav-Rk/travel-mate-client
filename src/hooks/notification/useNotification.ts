import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {  QueryFunction, UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useGetNotifications = <T>(
  queryKey: string[],
  queryFn: QueryFunction<T>,
  options?: any
) => {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...options
  });
};


// generic mutation hook
export const useMarkNotificationRead = <TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, AxiosError, TVariables> => {
  const queryClient = useQueryClient();
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    onSuccess : () => queryClient.invalidateQueries({queryKey : ["notifications-client"]})
  });
};


export const useMarkAllNotificationsRead = <TData = unknown>(
  mutationFn: () => Promise<TData>,
): UseMutationResult<TData, AxiosError, void> => {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, void>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-client"] });
    },
  });
};