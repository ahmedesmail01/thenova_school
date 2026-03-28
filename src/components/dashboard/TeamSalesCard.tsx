import { useState } from "react";
import { Network, ArrowLeft, ArrowRight, Globe, Users } from "lucide-react";
import { cn } from "../../lib/utils";
import type { DashboardData } from "../../hooks/dashboard/useDashboardData";
import { StatItem } from "./team-sales/StatItem";
import { TimePeriodDropdown } from "./team-sales/TimePeriodDropdown";
import { type TimePeriod } from "./team-sales/constants";
import { SalesDonutChart } from "./team-sales/SalesDonutChart";

interface TeamSalesCardProps {
  className?: string;
  data: DashboardData | undefined;
}

export function TeamSalesCard({ className, data }: TeamSalesCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("now");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getActiveCvCounts = () => {
    switch (selectedPeriod) {
      case "7days":
        return data?.last7DaysCvCounts;
      case "30days":
        return data?.last30DaysCvCounts;
      case "year":
        return data?.lastYearCvCounts;
      default:
        return data?.nowCvCounts;
    }
  };

  const activeCv = getActiveCvCounts();

  // Calculate rank goal progress: each of the 4 goals contributes 25% when fully achieved (>=100%)
  const isGoalAchieved = (
    userVal: number | null | undefined,
    targetVal: number | null | undefined,
  ) => {
    const user = Number(userVal) || 0;
    const target = Number(targetVal) || 0;
    if (target === 0) return false;
    return user >= target;
  };

  const nextRank = data?.next_rank;
  const achievedGoals = [
    isGoalAchieved(nextRank?.user_left_volume, nextRank?.left_volume),
    isGoalAchieved(nextRank?.user_right_volume, nextRank?.right_volume),
    isGoalAchieved(nextRank?.user_left_referrals, nextRank?.left_referrals),
    isGoalAchieved(nextRank?.user_right_referrals, nextRank?.right_referrals),
  ].filter(Boolean).length;

  const rankProgress = achievedGoals * 25; // 0 | 25 | 50 | 75 | 100

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col h-full",
        className,
      )}
    >
      {/* Top Half: Gradient + Background Image */}
      <div className="relative pt-6 pb-6 px-8 bg-[#1a2d42] min-h-[380px] flex flex-col">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 mix-blend-soft-light pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/polygons.png")' }}
        />

        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center relative z-10">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Team Sales
          </h3>
          <TimePeriodDropdown
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>

        {/* Donut Chart — progress in 25% steps based on next rank goals */}
        <SalesDonutChart progress={rankProgress} />

        {/* Binary Info Text Overlay */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-12 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] z-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            Binary Analysis
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            Live Volume
          </div>
        </div>
      </div>

      {/* Bottom Half: Stats Grid */}
      <div className="p-6 -mt-10 relative z-20 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={Network}
            value={
              data?.downline_counts?.left_downlines_count?.toString() ?? "0"
            }
            label="Left Downline Members"
            iconColor="text-[#6366f1]"
            iconSrc="/icons/left-sales-icon.png"
          />
          <StatItem
            icon={Network}
            value={
              data?.downline_counts?.right_downlines_count?.toString() ?? "0"
            }
            label="Right Downline Members"
            iconColor="text-[#10b981]"
            iconSrc="/icons/right-sales-icon.png"
          />
          <StatItem
            icon={ArrowLeft}
            value={`${activeCv?.left_cv_count ?? "0.00"} CV`}
            label="Left Sales"
            iconColor="text-[#f59e0b]"
            iconSrc="/icons/left-carry-icon.png"
          />
          <StatItem
            icon={ArrowRight}
            value={`${activeCv?.right_cv_count ?? "0.00"} CV`}
            label="Right Sales"
            iconColor="text-[#ef4444]"
            iconSrc="/icons/right-carry-icon.png"
          />
          <StatItem
            icon={Globe}
            value={`${data?.total_cv_counts ?? "0.00"} CV`}
            label="Total Network volume"
            iconColor="text-[#a855f7]"
            iconSrc="/icons/total-network-volume-icon.png"
          />
          <StatItem
            icon={Users}
            value={(
              (Number(data?.downline_counts?.left_downlines_count) || 0) +
              (Number(data?.downline_counts?.right_downlines_count) || 0)
            ).toString()}
            label="Total down line"
            iconColor="text-[#3b82f6]"
            iconSrc="/icons/total-downline-icon.png"
          />
        </div>
      </div>
    </div>
  );
}
