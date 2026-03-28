import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface NetworkVolumeResponse {
  status: boolean;
  message: string;
  network_volume: {
    left_leg_volume: number;
    right_leg_volume: number;
  };
}

/**
 * Custom hook to fetch the network volume for both left and right legs.
 *
 * Target API: https://dev.thenovagroupco.com/api/v1/network-volume
 * Note: The base URL is managed by the api instance in src/lib/api.ts
 */
export const useNetworkVolume = () => {
  return useQuery<NetworkVolumeResponse>({
    queryKey: ["networkVolume"],
    queryFn: async () => {
      const response = await api.get("/network-volume");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
