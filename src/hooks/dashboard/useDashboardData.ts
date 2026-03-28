import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface DownlineDetail {
  rank: string;
  left: number;
  right: number;
}

export interface DownlineCounts {
  left_downlines_count: number;
  right_downlines_count: number;
}

export interface CVCounts {
  left_cv_count: number;
  right_cv_count: number;
}

export interface UserPackage {
  name: string;
  pack_card: string | null;
}

export interface RankInfo {
  name: string;
  image: string | null;
  package: string;
}

export interface NextRankInfo {
  name: string;
  left_volume: number;
  user_left_volume: number | null;
  right_volume: number;
  user_right_volume: number | null;
  left_referrals: number;
  user_left_referrals: number;
  right_referrals: number;
  user_right_referrals: number;
}

export interface WeeklyEarning {
  week: number;
  total: number;
}

export interface MonthlyEarning {
  month: string;
  total: number;
}

export interface DashboardData {
  status: boolean;
  down_lineDetails: DownlineDetail[];
  downline_counts: DownlineCounts;
  nowCvCounts: CVCounts;
  last7DaysCvCounts: CVCounts;
  last30DaysCvCounts: CVCounts;
  lastYearCvCounts: CVCounts;
  user_package: UserPackage;
  rank: RankInfo;
  next_rank: NextRankInfo;
  remaining_days: number;
  weekly_earnings: WeeklyEarning[];
  monthly_earnings: MonthlyEarning[];
  targets: number;
  total_cv_counts: number;
  total_commissions: number;
}

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
}

export const useDashboardData = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await api.get("/member/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
