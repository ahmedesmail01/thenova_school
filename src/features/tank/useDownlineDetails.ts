import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface DownlineDetail {
  rank: string;
  left: number;
  right: number;
}

export interface DownlineDetailsResponse {
  member_id: number;
  downline_details: DownlineDetail[];
}

/**
 * Custom hook to fetch rank-based downline details.
 *
 * Target API: https://dev.thenovagroupco.com/api/v1/members/downlines
 * Note: The base URL is managed by the api instance in src/lib/api.ts
 */
export const useDownlineDetails = () => {
  return useQuery<DownlineDetailsResponse>({
    queryKey: ["downlineDetails"],
    queryFn: async () => {
      const response = await api.get("/members/downlines");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
