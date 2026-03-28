import type { DashboardData } from "../../hooks/dashboard/useDashboardData";
import SummaryCard from "./SummaryCard";
// import { Trophy, Wallet, Zap } from "lucide-react";

interface SummaryRowProps {
  data: DashboardData | undefined;
}

const SummaryRow = ({ data }: SummaryRowProps) => {
  const dollarIcon = "/icons/dollar.png";
  const trophyIcon = "/icons/free-pack.png";
  const zapIcon = "/icons/nova-rise-pack.png";
  const walletIcon = "/icons/bronze-pack.png";

  // const totalVolume =
  //   (data?.nowCvCounts?.left_cv_count || 0) +
  //   (data?.nowCvCounts?.right_cv_count || 0);

  const totalCommissions = data?.total_commissions || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        iconSrc={dollarIcon}
        title={`${Number(totalCommissions).toFixed(2)}`}
        label="Total Commissions"
        showAll
        link="/commissions"
      />
      <SummaryCard
        iconSrc={trophyIcon}
        title={data?.user_package?.name || "Member"}
        label="Current Package"
      />
      <SummaryCard
        iconSrc={zapIcon}
        title={data?.next_rank?.name || "Next Rank"}
        label="Next Rank"
      />
      <SummaryCard
        iconSrc={walletIcon}
        title={data?.rank?.name || "No Rank"}
        label={data?.rank?.name || ""}
      />
    </div>
  );
};

export default SummaryRow;
