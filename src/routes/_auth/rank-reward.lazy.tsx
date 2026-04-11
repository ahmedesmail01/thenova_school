import { RankRewardCard } from "../../components/dashboard/RankRewardCard";
import { useMyRanks } from "../../features/wallet/useMyRanks";


export default function RankRewardPage() {
  const { data, isLoading } = useMyRanks();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-slate-400 font-medium animate-pulse">
          Loading ranks...
        </div>
      </div>
    );
  }

  const ranks = data?.data || [];

  return (
    <div className="min-h-[calc(100vh-100px)] bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-[1500px] mx-auto p-4 lg:p-6 lg:px-20 lg:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {ranks.map((rank) => (
          <RankRewardCard
            key={rank.rank_id}
            label={rank.rank_name}
            imageSrc={rank.rank_image || "/images/ranks/rank-placeholder.png"}
            active={rank.active}
          />
        ))}

        {ranks.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
            No ranks found.
          </div>
        )}
      </div>
    </div>
  );
}
