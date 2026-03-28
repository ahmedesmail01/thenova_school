import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface Rank {
  rank_id: number;
  rank_name: string;
  rank_image: string | null;
  active: boolean;
}

export interface MyRanksResponse {
  status: string;
  data: Rank[];
}

export const useMyRanks = () => {
  return useQuery<MyRanksResponse>({
    queryKey: ["myRanks"],
    queryFn: async () => {
      const response = await api.get("/my-ranks");
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (ranks don't change often)
  });
};
