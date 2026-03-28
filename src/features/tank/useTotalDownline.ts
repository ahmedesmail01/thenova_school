import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface TotalDownlineResponse {
  status: boolean;
  message: string;
  count: {
    left_downlines_count: number;
    right_downlines_count: number;
  };
}

/**
 * Custom hook to fetch the total count of left and right downlines.
 *
 * Target API: https://dev.thenovagroupco.com/api/v1/total-down-line
 * Note: The base URL is managed by the api instance in src/lib/api.ts
 */
export const useTotalDownline = () => {
  return useQuery<TotalDownlineResponse>({
    queryKey: ["totalDownline"],
    queryFn: async () => {
      const response = await api.get("/total-down-line");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
