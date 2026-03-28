import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

// One small user object (sender / receiver)
export interface TransactionUser {
  id: number;
  id_code: number;
  username: string;
}

// Single transaction row
export interface Transaction {
  id: number;
  wallet_id: number | null;
  transaction_type: string;
  amount: string;
  status: string;
  sender_member_id: number | null;
  receive_member_id: number | null;
  credit_code: string | null;
  package_name: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  sender: TransactionUser;
  receiver: TransactionUser;
}

// Links object (first/last/prev/next)
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// Single link inside meta.links[]
export interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Meta object
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

// Generic paginated wrapper used for both `data` and `token`
export interface PaginatedTransactions {
  data: Transaction[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

// Full API response
export interface WalletTransactionsResponse {
  data: PaginatedTransactions;
  token: PaginatedTransactions;
}

export const useWalletTransactions = (page: number = 1) => {
  return useQuery<WalletTransactionsResponse>({
    queryKey: ["walletTransactions", page],
    queryFn: async () => {
      const response = await api.get(`/all-tarnsactions?page=${page}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
