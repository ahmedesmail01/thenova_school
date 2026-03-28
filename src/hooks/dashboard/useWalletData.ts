import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface WeeklyEarning {
  week: number;
  total: number;
}

export interface MonthlyBounce {
  month: string;
  total: number;
}

export interface WalletDataResponse {
  status: boolean;
  total_earnings: number;
  total_receive: number;
  total_transfer: number;
  total_bounce: number;
  weekly_earnings: WeeklyEarning[];
  monthly_bounce: MonthlyBounce[];
  balance: string;
  token_wallet_balance: string;
}

export const useWalletData = () => {
  return useQuery<WalletDataResponse>({
    queryKey: ["walletData"],
    queryFn: async () => {
      const response = await api.get("/member/wallet");
      const raw = response.data;

      return {
        ...raw,
        total_earnings: Number(raw.total_earnings || 0),
        total_receive: Number(raw.total_receive || 0),
        total_transfer: Number(raw.total_transfer || 0),
        total_bounce: Number(raw.total_bounce || 0),
        weekly_earnings:
          raw.weekly_earnings?.map(
            (w: { week: number; total: string | number }) => ({
              ...w,
              total: Number(w.total || 0),
            }),
          ) || [],
        monthly_bounce:
          raw.monthly_bounce?.map(
            (m: { month: string; total: string | number }) => ({
              ...m,
              total: Number(m.total || 0),
            }),
          ) || [],
        balance: String(raw.balance || "0"),
        token_wallet_balance: String(raw.token_wallet_balance || "0"),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
