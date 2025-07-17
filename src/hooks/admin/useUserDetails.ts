import type { UserType } from "./useAllUsers";
import type { VendorData } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

interface FetchUserParams {
  userType: UserType;
  userId: string;
}

type UserResponse<T> = {
  user: T;
};

export const useUserDetailsQuery = <T extends VendorData>(
  queryFunc: (params: FetchUserParams) => Promise<UserResponse<T>>,
  userType: UserType,
  userId: string
) => {
  return useQuery({
    queryKey: ["user-details", userType, userId],
    queryFn: () => queryFunc({ userType, userId }),
    placeholderData: (prevData) => prevData,
  });
};
