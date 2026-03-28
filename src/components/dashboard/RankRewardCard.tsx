import { Lock } from "lucide-react";

interface RankRewardCardProps {
  imageSrc: string;
  label: string;
  active: boolean;
}

export function RankRewardCard({
  imageSrc,
  label,
  active,
}: RankRewardCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-300 p-4 flex flex-col items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div
        className={`w-full aspect-4/3 rounded-[24px] overflow-hidden  flex items-center justify-center transition-all duration-500 ${!active ? "grayscale opacity-50 contrast-75" : "group-hover:scale-105"}`}
      >
        <img
          src={imageSrc}
          alt={label}
          className="w-full h-full object-cover rounded-[24px]"
        />

        {!active && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px]">
            <div className="bg-white/90 p-3 rounded-full shadow-lg">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <h3
          className={`font-bold text-lg transition-colors ${active ? "text-slate-800" : "text-slate-400"}`}
        >
          {label}
        </h3>
        {!active && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Locked
          </span>
        )}
      </div>
    </div>
  );
}
