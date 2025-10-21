import { TRANSACTION_TYPE, type WalletTransactions } from "@/types/wallet";
import { useMemo } from "react";
import WalletCard from "./WalletCard";
import WalletSearchBar from "./SearchBar";
import TransactionItem from "./TransactionItem";
import { Search } from "lucide-react";
import Pagination from "../Pagination";

interface WalletPageProps {
  currency?: string;
  balance: number;
  transactions: WalletTransactions[];

  activeTab: "all" | "credit" | "debit";
  searchQuery: string;
  sortOrder: "newest" | "oldest";

  totalPages: number;
  currentPage: number;

  onSearchChange: (query: string) => void;
  onTabChange: (tab: "all" | "credit" | "debit") => void;
  onSortChange: (sort: "newest" | "oldest") => void;

  onPageChange?: (page: number) => void;
  userType?: "client" | "vendor" | "admin";
}

const Wallet: React.FC<WalletPageProps> = ({
  currency = "₹",
  balance,
  transactions,
  activeTab,
  onSearchChange,
  onSortChange,
  onTabChange,
  searchQuery,
  sortOrder,
  totalPages=1,
  currentPage=1,
  onPageChange,
  userType = "client",
}) => {
  const { totalIn, totalOut } = useMemo(() => {
    const totalIn = transactions
      .filter((t) => t.type === TRANSACTION_TYPE.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOut = transactions
      .filter((t) => t.type === TRANSACTION_TYPE.DEBIT)
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIn, totalOut };
  }, [transactions]);

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Wallet
          </h1>
          <p className="text-gray-600">Manage your transactions and balance</p>
        </div>

        <div className="mb-8">
          <WalletCard
            currency={currency}
            balance={balance}
            totalIn={totalIn}
            totalOut={totalOut}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transactions
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <WalletSearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                />
              </div>

              <select
                value={sortOrder}
                onChange={(e) =>
                  onSortChange(e.target.value as "newest" | "oldest")
                }
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex gap-2 border-b-2 border-gray-200">
              <button
                onClick={() => onTabChange("all")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "all"
                    ? "text-teal-600 border-b-3 border-teal-600 -mb-0.5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => onTabChange("credit")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "credit"
                    ? "text-teal-600 border-b-3 border-teal-600 -mb-0.5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Credit
              </button>
              <button
                onClick={() => onTabChange("debit")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "debit"
                    ? "text-teal-600 border-b-3 border-teal-600 -mb-0.5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Debit
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                  currency={currency}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No transactions found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange!}
          />
        </div>
      </div>
    </div>
  );
};

export default Wallet;

