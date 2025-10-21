import { TRANSACTION_TYPE, type WalletTransactions } from "@/types/wallet";
import { ArrowDownLeft, ArrowUpRight, Calendar } from "lucide-react";

const TransactionItem: React.FC<{
  transaction: WalletTransactions;
  currency: string;
}> = ({ transaction, currency }) => {
  const isCredit = transaction.type === TRANSACTION_TYPE.CREDIT;
  const date = transaction.createdAt
    ? new Date(transaction.createdAt)
    : new Date();

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-teal-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`rounded-full p-2.5 ${
              isCredit ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {transaction.description || "Transaction"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-sm text-gray-500">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {transaction.referenceId && (
              <p className="text-xs text-gray-400 mt-1">
                Ref: {transaction.referenceId}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              isCredit ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCredit ? "+" : "-"} {currency}{" "}
            {transaction.amount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};


export default TransactionItem