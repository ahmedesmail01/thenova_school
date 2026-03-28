import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface Commission {
  id: number;
  commission_value: string;
  commission_type: string;
  created_at: string;
  referral_username: string | null;
  referral_id_code: string | null;
}

export interface CommissionSummaryResponse {
  commissions: Commission[];
}

export const useCommissionSummary = () => {
  return useQuery<CommissionSummaryResponse>({
    queryKey: ["commissionSummary"],
    queryFn: async () => {
      const response = await api.get("/commission-summary");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
