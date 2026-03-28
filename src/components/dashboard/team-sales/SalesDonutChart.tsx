// import React from "react";

interface SalesDonutChartProps {
  progress: number; // 0 to 100, in 25% steps
}

export function SalesDonutChart({ progress }: SalesDonutChartProps) {
  const dashArray = 427;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const dashOffset = dashArray - dashArray * (clampedProgress / 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="68"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="20"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="88"
            cy="88"
            r="68"
            stroke="#ff5e5e"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={dashArray.toString()}
            strokeDashoffset={dashOffset.toString()}
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(255,94,94,0.4)] transition-all duration-1000"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {clampedProgress}%
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
            Rank Progress
          </span>
        </div>
      </div>
    </div>
  );
}
