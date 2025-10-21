// import { TrendingDown, TrendingUp } from "lucide-react";

import { TrendingDown, TrendingUp } from "lucide-react";

const WalletCard: React.FC<{
  currency: string;
  balance: number;
  totalIn: number;
  totalOut: number;
}> = ({ currency, balance, totalIn, totalOut }) => {
  return (
    <div className="bg-gradient-to-br from-teal-500 via-cyan-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-teal-100 text-sm font-medium mb-1">
            Available Balance
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            {currency} {balance.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-400/30 rounded-full p-1">
              <TrendingUp className="w-4 h-4 text-green-100" />
            </div>
            <span className="text-teal-100 text-xs font-medium">Total In</span>
          </div>
          <p className="text-xl font-bold">
            {currency} {totalIn.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-red-400/30 rounded-full p-1">
              <TrendingDown className="w-4 h-4 text-red-100" />
            </div>
            <span className="text-teal-100 text-xs font-medium">Total Out</span>
          </div>
          <p className="text-xl font-bold">
            {currency} {totalOut.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;

