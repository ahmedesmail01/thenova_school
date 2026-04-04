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
  icon: string | null;
  name: string;
  image: string | null;
  package: string;
}

export interface DownlineRequirement {
  rank_id: number;
  count: number;
}

export interface Rank {
  id: number;
  name: string;
  package: string;
  left_volume: number;
  right_volume: number;
  direct_referrals: number;
  downline_requirements: {
    left: DownlineRequirement;
    right: DownlineRequirement;
  };
  created_at: string;
  updated_at: string;
  image: string | null;
  icon: string;
}

export interface DownlineProgress {
  required_rank: Rank;
  required_count: number;
  current_count: number;
}

export interface NextRankInfo {
  name: string;
  icon: string;
  left_volume: number;
  user_left_volume: string | null;
  right_volume: number;
  user_right_volume: string | null;
  direct_referrals: number;
  user_direct_referrals: number;
  user_downline_progress: {
    left: DownlineProgress;
    right: DownlineProgress;
  } | null;
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
