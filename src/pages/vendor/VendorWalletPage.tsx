"use client";
import Wallet from "@/components/wallet/Wallet";
import {
  useGetWallet,
  useGetWalletTransactions,
} from "@/hooks/wallet/useWallet";
import { getWalletTransactionsVendor, getWalletVendor } from "@/services/vendor/vendorService";
import type { GetWalletDto, WalletTransactions } from "@/types/wallet";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface TransactionFilters {
  type: "all" | "credit" | "debit";
  searchQuery: string;
  sortOrder: "newest" | "oldest";
  limit: number;
}

export default function VendorWalletPage() {
  const [transactions, setTransactions] = useState<WalletTransactions[]>([]);
  const [wallet, setWallet] = useState<GetWalletDto>();

  const [filters, setFilters] = useState<TransactionFilters>({
    type: "all",
    searchQuery: "",
    sortOrder: "newest",
    limit: 10,
  });

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);


  const { data, isLoading } = useGetWallet(getWalletVendor);

  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetWalletTransactions(
      getWalletTransactionsVendor,
      wallet?._id!,
      page,
      filters.limit,
      filters.type,
      filters.sortOrder,
      filters.searchQuery
    );

  useEffect(() => {
    if (!data) return;
    setWallet(data.data);
  }, [data]);

  useEffect(() => {
    if (!transactionsData) return;
    setTransactions(transactionsData.data);
    setCurrentPage(transactionsData.currentPage);
    setTotalPages(transactionsData.totalPages);
  }, [transactionsData]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<TransactionFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }));
    },
    []
  );

  // Handler for search with debounce
  const searchDebounceRef = useRef<number | undefined>(undefined);
  const handleSearch = useCallback(
    (query: string) => {
      if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = window.setTimeout(() => {
        handleFilterChange({ searchQuery: query });
      }, 300);
    },
    [handleFilterChange]
  );

  // Handler for type filter
  const handleTypeChange = useCallback(
    (type: "all" | "credit" | "debit") => {
      handleFilterChange({ type });
    },
    [handleFilterChange]
  );

  // Handler for sort order
  const handleSortChange = useCallback(
    (sortOrder: "newest" | "oldest") => {
      handleFilterChange({ sortOrder });
    },
    [handleFilterChange]
  );

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 md:ml-80 flex flex-col h-full"
      >
        <div className="p-4 md:p-8 h-full w-full overflow-auto">
          {wallet && transactions && (
            <Wallet
              balance={wallet?.balance!}
              transactions={transactions}
              activeTab={filters.type}
              searchQuery={filters.searchQuery}
              sortOrder={filters.sortOrder}
              currentPage={page}
              totalPages={totalPages}
              onSearchChange={handleSearch}
              onTabChange={handleTypeChange}
              onSortChange={handleSortChange}
              onPageChange={setPage}
            />
          )}
        </div>
      </motion.main>
    </div>
  );
}
