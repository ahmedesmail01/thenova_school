import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface RankInfo {
  name: string;
  image: string | null;
  package: string;
}

export interface NextRankInfo {
  id: number;
  name: string;
  package: string;
  left_volume: number;
  right_volume: number;
  direct_referrals: number;
  downline_requirements: unknown | null;
  created_at: string;
  updated_at: string;
  image: string | null;
}

export interface UserRankResponse {
  status: boolean;
  message: string;
  rank: RankInfo;
  next_rank: NextRankInfo;
  remaining_days: number;
}

/**
 * Custom hook to fetch the user's current rank, next rank requirements, and remaining days.
 *
 * Target API: https://dev.thenovagroupco.com/api/v1/rank
 * Note: The base URL is managed by the api instance in src/lib/api.ts
 */
export const useUserRank = () => {
  return useQuery<UserRankResponse>({
    queryKey: ["userRank"],
    queryFn: async () => {
      const response = await api.get("/rank");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
