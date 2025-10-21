import type {
  IGetWalletResponse,
  IGetWalletTransactionsResponse,
} from "@/types/api/client";
import { useQuery } from "@tanstack/react-query";

interface FetchWalletTransactionsParams {
  walletId: string;
  page: number;
  limit: number;
  type: string;
  sortBy: string;
  searchTerm: string;
}

//get wallet
export const useGetWallet = (
  queryFn: () => Promise<IGetWalletResponse>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn,
    enabled,
  });
};

//get all transactions  query
export const useGetWalletTransactions = (
  queryFunc: (
    params: FetchWalletTransactionsParams
  ) => Promise<IGetWalletTransactionsResponse>,
  walletId: string,
  page: number,
  limit: number,
  type: string,
  sortBy: string,
  searchTerm: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "wallet-transactions",
      page,
      limit,
      walletId,
      type,
      sortBy,
      searchTerm,
    ],
    queryFn: () =>
      queryFunc({
        walletId,
        page,
        limit,
        type,
        sortBy,
        searchTerm,
      }),
    placeholderData: (prevData) => prevData,
    enabled: enabled && !!walletId,
  });
};
