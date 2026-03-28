import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatPrice } from "../../../lib/utils";

interface WalletBalancesProps {
  currentBalance?: string;
  tokenBalance?: string;
  isCurrentLoading?: boolean;
  isTokenLoading?: boolean;
}

export function WalletBalances({
  currentBalance,
  tokenBalance,
  isCurrentLoading,
  isTokenLoading,
}: WalletBalancesProps) {
  const [showCommission, setShowCommission] = useState(false);
  const [showToken, setShowToken] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Commission Wallet */}
      <div className="bg-[#10b981] rounded-[16px] px-12 py-5 text-white flex justify-between items-center relative overflow-hidden ">
        {/* Left Indent Tab */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-20 bg-white rounded-r-[6px]" />

        <div className="space-y-5">
          <p className="font-semibold text-[18px] tracking-tight">
            Commission Wallet Balance
          </p>
          <p className="font-bold text-[18px] tracking-widest opacity-95">
            {isCurrentLoading
              ? "Loading..."
              : showCommission
                ? formatPrice(Number(currentBalance) || 0)
                : "*********"}
          </p>
        </div>
        <button
          onClick={() => setShowCommission(!showCommission)}
          className="text-white/90 hover:text-white transition-colors"
        >
          {showCommission ? (
            <Eye size={30} strokeWidth={1.5} />
          ) : (
            <EyeOff size={30} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Token Wallet */}
      <div className="bg-[#295175] rounded-[16px] px-12 py-5 text-white flex justify-between items-center relative overflow-hidden ">
        {/* Left Indent Tab */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-20 bg-white rounded-r-[6px]" />

        <div className="space-y-5">
          <p className="font-semibold text-[18px] tracking-tight">
            Token Wallet Balance
          </p>
          <p className="font-bold text-[18px] tracking-tight">
            {isTokenLoading
              ? "Loading..."
              : showToken
                ? formatPrice(Number(tokenBalance) || 0)
                : "*********"}
          </p>
        </div>
        <button
          onClick={() => setShowToken(!showToken)}
          className="text-white/90 hover:text-white transition-colors"
        >
          {showToken ? (
            <Eye size={30} strokeWidth={1.5} />
          ) : (
            <EyeOff size={30} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}
