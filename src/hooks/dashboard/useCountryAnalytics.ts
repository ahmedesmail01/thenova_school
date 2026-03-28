import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface CountryData {
  country: string;
  code: string;
  count: number;
  percentage: string;
}

export interface CountryAnalyticsResponse {
  status: boolean;
  data: CountryData[];
}

export const useCountryAnalytics = () => {
  return useQuery<CountryAnalyticsResponse>({
    queryKey: ["countryAnalytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/countries");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
