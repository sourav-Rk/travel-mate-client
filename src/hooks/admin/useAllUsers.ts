import type { UserList } from "@/components/admin/UserManagement";
import type { VendorList } from "@/components/admin/vendorManagement/VendorManagement";
import { useQuery } from "@tanstack/react-query";
export type UserType = "client" | "vendor";

interface FetchUserParams {
  page: number;
  limit: number;
  userType: UserType;
  searchTerm : string;
  status : string;
}

type UsersResponse<T> ={ 
  users: T;
  totalPages: number;
  currentPage: number;
};


export const useAllUsersQuery = <T extends VendorList | UserList>(
  queryFunc: (params: FetchUserParams) => Promise<UsersResponse<T>>,
  page: number,
  limit: number,
  userType: UserType,
  searchTerm : string,
  status : string
) => {
  return useQuery({
    queryKey: ["users", userType, page, limit,searchTerm,status],
    queryFn: () => queryFunc({ userType, page, limit,status,searchTerm }),
    placeholderData: (prevData) => prevData,
  });
};
