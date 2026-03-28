import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import toast from "react-hot-toast";

export interface WalletTotalsResponse {
  status: boolean;
  total_earnings: number;
  total_receive: number;
  total_transfer: number;
  total_bounce: number;
}

export interface CurrentBalanceResponse {
  status: boolean;
  balance: string;
}

export interface TokenWalletBalanceResponse {
  status: boolean;
  token_wallet_balance: string;
}

export interface WeeklyEarning {
  week: number;
  total: number;
}

export interface MonthlyBounce {
  month: string;
  total: number;
}

export interface WalletReportsResponse {
  status: boolean;
  weekly_earnings: WeeklyEarning[];
  monthly_bounce: MonthlyBounce[];
}

export const useWalletTotals = () => {
  return useQuery<WalletTotalsResponse>({
    queryKey: ["walletTotals"],
    queryFn: async () => {
      const response = await api.get("/wallet-totals");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCurrentBalance = () => {
  return useQuery<CurrentBalanceResponse>({
    queryKey: ["currentBalance"],
    queryFn: async () => {
      const response = await api.get("/current-balance");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTokenWalletBalance = () => {
  return useQuery<TokenWalletBalanceResponse>({
    queryKey: ["tokenWalletBalance"],
    queryFn: async () => {
      const response = await api.get("/token-wallet-balance");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useWalletReports = () => {
  return useQuery<WalletReportsResponse>({
    queryKey: ["walletReports"],
    queryFn: async () => {
      const response = await api.get("/wallet-reports");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTransferToTokenWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, pin }: { amount: number; pin: string }) => {
      const response = await api.post("/transfer-to-token-wallet", {
        amount,
        pin_code: pin,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Transfer successful!");
      queryClient.invalidateQueries({ queryKey: ["currentBalance"] });
      queryClient.invalidateQueries({ queryKey: ["tokenWalletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTotals"] });
      queryClient.invalidateQueries({ queryKey: ["walletReports"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Transfer failed",
      );
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      pin: string;
      address: string;
      network: string;
    }) => {
      const response = await api.post("/wallet/transactions", {
        amount: data.amount,
        pin_code: data.pin,
        address: data.address,
        network: data.network,
        transaction_type: "commission_transaction",
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Withdrawal request sent!");
      queryClient.invalidateQueries({ queryKey: ["currentBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTotals"] });
      queryClient.invalidateQueries({ queryKey: ["walletReports"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Withdrawal failed",
      );
    },
  });
};

export const useInternalTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      recipient_member_code: string;
      amount: number;
      pin: string;
    }) => {
      const response = await api.post("/internal-transfer", {
        recipient_member_code: data.recipient_member_code,
        amount: data.amount,
        pin_code: data.pin,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Internal transfer successful!");
      queryClient.invalidateQueries({ queryKey: ["currentBalance"] });
      queryClient.invalidateQueries({ queryKey: ["walletTotals"] });
      queryClient.invalidateQueries({ queryKey: ["walletReports"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Internal transfer failed",
      );
    },
  });
};
