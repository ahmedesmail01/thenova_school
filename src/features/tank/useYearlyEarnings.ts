import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface WeeklyEarning {
  week: number;
  total: number;
}

export interface MonthlyEarning {
  month: string;
  total: number;
}

export interface YearlyEarningsResponse {
  status: boolean;
  weekly_earnings: WeeklyEarning[];
  monthly_earnings: MonthlyEarning[];
  targets: number;
}

/**
 * Custom hook to fetch weekly and monthly earnings data for the year.
 *
 * Target API: https://dev.thenovagroupco.com/api/v1/yearly-sales-in-Weeks
 * Note: The base URL is managed by the api instance in src/lib/api.ts
 */
export const useYearlyEarnings = () => {
  return useQuery<YearlyEarningsResponse>({
    queryKey: ["yearlyEarnings"],
    queryFn: async () => {
      const response = await api.get("/yearly-sales-in-Weeks");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
