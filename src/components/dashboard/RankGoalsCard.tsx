import type { DashboardData } from "../../hooks/dashboard/useDashboardData";
import { cn } from "../../lib/utils";

interface RankGoalItemProps {
  label: string;
  percentage: string;
  achieved: string;
  progress: number; // 0 to 100
  requiredRankName?: string;
}

interface Props {
  data: DashboardData | undefined;
  className?: string;
}

function GoalItem({
  label,
  percentage,
  achieved,
  progress,
  requiredRankName,
}: RankGoalItemProps) {
  return (
    <div className="space-y-2 py-2.5 border-b border-slate-50 last:border-0 relative z-10">
      <div className="flex justify-between items-center">
        <span className="text-[16px] text-slate-400">{label}</span>
        <div className="px-2.5 py-0.5 rounded-lg border border-blue-400 text-brand-blue-btn text-[11px] font-bold">
          {percentage}
        </div>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2C5D81] rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[14px]">
        <span className="font-bold text-brand-blue-btn">{achieved}</span>
        <span className="text-slate-300 mx-2 ">Achieved</span>
        {requiredRankName && (
          <span className="text-slate-400 mx-2 font-semibold">
            Rank:{requiredRankName}
          </span>
        )}
      </p>
    </div>
  );
}

export function RankGoalsCard({ className, data }: Props) {
  const bgPattern = "/images/union.png";

  const nextRank = data?.next_rank;

  const calculateProgress = (
    userVal: number | null,
    targetVal: number | null,
  ) => {
    if (!targetVal || targetVal === 0) return 0;
    const progress = ((userVal || 0) / targetVal) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const getPercentageString = (
    userVal: number | null,
    targetVal: number | null,
  ) => {
    const progress = calculateProgress(userVal, targetVal);
    return `${progress}.00%`;
  };

  const getAchievedString = (
    userVal: number | null,
    targetVal: number | null,
  ) => {
    return `${userVal || 0}/${targetVal || 0}`;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden flex flex-col h-full",
        className,
      )}
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: "70%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-[18px] font-bold text-gray-700 mb-4 relative z-10">
        Next Rank Goals
      </h3>

      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <GoalItem
          label="Team Volume in LEFT"
          percentage={getPercentageString(
            Number(nextRank?.user_left_volume) || 0,
            Number(nextRank?.left_volume) || 0,
          )}
          achieved={getAchievedString(
            Number(nextRank?.user_left_volume) || 0,
            Number(nextRank?.left_volume) || 0,
          )}
          progress={calculateProgress(
            Number(nextRank?.user_left_volume) || 0,
            Number(nextRank?.left_volume) || 0,
          )}
        />
        <GoalItem
          label="Team Volume in RIGHT"
          percentage={getPercentageString(
            Number(nextRank?.user_right_volume) || 0,
            Number(nextRank?.right_volume) || 0,
          )}
          achieved={getAchievedString(
            Number(nextRank?.user_right_volume) || 0,
            Number(nextRank?.right_volume) || 0,
          )}
          progress={calculateProgress(
            Number(nextRank?.user_right_volume) || 0,
            Number(nextRank?.right_volume) || 0,
          )}
        />
        <GoalItem
          label="Direct Recruits"
          percentage={getPercentageString(
            Number(nextRank?.user_direct_referrals) || 0,
            Number(nextRank?.direct_referrals) || 0,
          )}
          achieved={getAchievedString(
            Number(nextRank?.user_direct_referrals) || 0,
            Number(nextRank?.direct_referrals) || 0,
          )}
          progress={calculateProgress(
            Number(nextRank?.user_direct_referrals) || 0,
            Number(nextRank?.direct_referrals) || 0,
          )}
        />
        {nextRank?.user_downline_progress && (
          <>
            <GoalItem
              label="Direct Recruits Rank in RIGHT"
              requiredRankName={
                nextRank?.user_downline_progress.right.required_rank.name
              }
              percentage={getPercentageString(
                Number(nextRank?.user_downline_progress.right.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.right.required_count) ||
                  0,
              )}
              achieved={getAchievedString(
                Number(nextRank?.user_downline_progress.right.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.right.required_count) ||
                  0,
              )}
              progress={calculateProgress(
                Number(nextRank?.user_downline_progress.right.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.right.required_count) ||
                  0,
              )}
            />
            <GoalItem
              label="Direct Recruits Rank in LEFT"
              requiredRankName={
                nextRank?.user_downline_progress.left.required_rank.name
              }
              percentage={getPercentageString(
                Number(nextRank?.user_downline_progress.left.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.left.required_count) ||
                  0,
              )}
              achieved={getAchievedString(
                Number(nextRank?.user_downline_progress.left.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.left.required_count) ||
                  0,
              )}
              progress={calculateProgress(
                Number(nextRank?.user_downline_progress.left.current_count) ||
                  0,
                Number(nextRank?.user_downline_progress.left.required_count) ||
                  0,
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
