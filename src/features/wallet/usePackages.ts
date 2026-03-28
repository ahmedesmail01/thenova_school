import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface Package {
  id: number;
  name: string;
  price: string;
  billing_period: string;
  cv: number;
  features: Record<string, boolean>;
  pack_card: string | null;
  created_at: string;
  updated_at: string;
}

export const usePackages = () => {
  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await api.get("/packages");
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
