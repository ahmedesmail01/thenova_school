import React from "react";
import { cn } from "../../../lib/utils";

interface StatItemProps {
  icon?: React.ElementType;
  value: string;
  label: string;
  iconColor: string;
  iconBg?: string;
  iconSrc: string;
}

export function StatItem({
  value,
  label,
  iconColor,
  iconBg,
  iconSrc,
}: StatItemProps) {
  return (
    <div className="bg-white rounded-[5px] p-4 border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-1",
          iconBg,
          iconColor,
        )}
      >
        <img src={iconSrc} alt="icon" />
      </div>
      <p className="text-sm font-black text-[#1a2d42] mb-0.5">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
        {label}
      </p>
    </div>
  );
}
