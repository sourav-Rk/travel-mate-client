import { ADMIN_API } from "@/constants/api/admin.api";
import { server } from "../server";
import type {
  IGetAllPackagesListAdminResponse,
  IGetAllUsersResponse,
  IGetPackageDetailsAdminResponse,
  IGetUserDetailsAdminResponse,
} from "@/types/api/admin";
import type { IResponse } from "@/types/Response";
import type {
  IGetWalletResponse,
  IGetWalletTransactionsResponse,
} from "@/types/api/client";

// ================== ADMIN SERVICE ==================

//-----------------Get all users with filters-----------------
export const getAllUsers = <T>(params: {
  userType: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}): Promise<IGetAllUsersResponse<T>> => {
  return server.get<IGetAllUsersResponse<T>>("/admin/users", { params });
};

//---------------- Get details of a specific user----------------
export const getUserDetails = async (params: {
  userType: string;
  userId: string;
}) =>
  server.get<IGetUserDetailsAdminResponse>(ADMIN_API.GET_USER_DETAILS, {
    params,
  });

//---------------- Update vendor status (approve/reject/review)----------------
export const updateVendorStatus = async (payload: {
  vendorId: string;
  status: string;
  reason?: string;
}) =>
  server.patch<IResponse>(ADMIN_API.UPDATE_VENDOR_STATUS, payload, {
    params: payload,
  });

//---------------- Block or unblock a user----------------
export const updateUserStatus = async (data: {
  userType: string;
  userId: string;
}) =>
  server.patch<IResponse>(ADMIN_API.UPDATE_USER_STATUS, {}, { params: data });

//---------------- Get vendor KYC document signed URLs----------------
export const getVendorKycUrlsForAdmin = async (data: string[]) =>
  server
    .post<{ urls: string[] }>(ADMIN_API.GET_VENDOR_KYC_URLS, { data })
    .then((res) => res.urls);

//----------------Get all packages with filters----------------
export const getAllPackages = async (params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
  userType?: string;
}) =>
  server.get<IGetAllPackagesListAdminResponse>(ADMIN_API.GET_ALL_PACKAGES, {
    params,
  });

//----------------Get details of a specific package----------------
export const getPackageDetails = async (packageId: string, userType: string) =>
  server.get<IGetPackageDetailsAdminResponse>(
    ADMIN_API.GET_PACKAGE_DETAILS(packageId),
    { params: { userType } }
  );

//----------------Block or unblock a package----------------
export const updatePackageBlockStatus = async (packageId: string) =>
  server.put<IResponse>(ADMIN_API.UPDATE_PACKAGE_BLOCK_STATUS, { packageId });

//------------get wallet transactions----------
export const getWalletTransactionsAdmin = async ({
  walletId,
  page = 1,
  limit = 10,
  type,
  searchTerm,
  sortBy,
}: {
  walletId: string;
  page: number;
  limit: number;
  type: string;
  sortBy: string;
  searchTerm: string;
}) =>
  server.get<IGetWalletTransactionsResponse>(
    ADMIN_API.GET_WALLET_TRANSACTIONS,
    {
      params: {
        walletId,
        page,
        limit,
        type,
        searchTerm,
        sortBy,
      },
    }
  );

//-------------get wallet-------------------
export const getWalletAdmin = async () =>
  server.get<IGetWalletResponse>(ADMIN_API.GET_WALLET);
