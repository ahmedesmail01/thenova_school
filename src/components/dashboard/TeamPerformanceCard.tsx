import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import Card from "./Card";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function PerformanceTab({ label, isActive, onClick }: TabProps) {
  // r = corner radius for the rounded top, c = radius for the inverted bottom curves
  const r = 20;
  const c = 20;

  return (
    <div className="relative isolate text-center shrink-0 min-w-[90px]">
      <button
        onClick={onClick}
        className={cn(
          "w-full py-1 px-2 text-[10px] sm:text-[10px] md:text-[12px] font-semibold transition-all relative z-10 whitespace-nowrap",
          isActive ? "text-[#1a2d42]" : "text-slate-400 hover:text-slate-500",
        )}
      >
        {label}
      </button>

      {isActive && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ left: -c, right: -c }}
        >
          <svg
            className="w-full h-full"
            viewBox={`0 0 100 100`}
            preserveAspectRatio="none"
            fill="none"
          >
            {/* 
              Single continuous path for the entire tab shape:
              - Start at bottom-left (0, 100) on the baseline
              - Inverted curve going up to (c%, 100) 
              - Straight up the left side to the top-left corner
              - Rounded top-left corner
              - Straight across the top
              - Rounded top-right corner
              - Straight down the right side
              - Inverted curve going down to (100, 100) on the baseline
            */}
            {/* percentage-based values for c and r */}
            <path
              d={`
                M 0 100
                Q ${(c / (100 + 2 * c)) * 100} 100, ${(c / (100 + 2 * c)) * 100} ${100 - (c / 100) * 100}
                L ${(c / (100 + 2 * c)) * 100} ${(r / 50) * 100}
                Q ${(c / (100 + 2 * c)) * 100} 0, ${((c + r) / (100 + 2 * c)) * 100} 0
                L ${100 - ((c + r) / (100 + 2 * c)) * 100} 0
                Q ${100 - (c / (100 + 2 * c)) * 100} 0, ${100 - (c / (100 + 2 * c)) * 100} ${(r / 50) * 100}
                L ${100 - (c / (100 + 2 * c)) * 100} ${100 - (c / 100) * 100}
                Q ${100 - (c / (100 + 2 * c)) * 100} 100, 100 100
              `}
              fill="white"
              stroke="var(--color-dash-border)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            {/* White line to cover the baseline under the tab */}
            <line
              x1={`${(c / (100 + 2 * c)) * 100}`}
              y1="100"
              x2={`${100 - (c / (100 + 2 * c)) * 100}`}
              y2="100"
              stroke="white"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function TeamPerformanceCard({
  className,
}: {
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState("Rank Overview");
  const tabs = [
    "Top Earners",
    "Rank Overview",
    "Package Overview",
    "New Members",
  ];

  return (
    <Card
      className={cn("lg:col-span-2 flex flex-col min-h-[500px]", className)}
      title="Team Performance"
      extra={
        <button className="flex items-center gap-2 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border border-slate-200 text-slate-400 focus:outline-none">
          Overall <ChevronDown size={14} />
        </button>
      }
    >
      <div className="mt-4 px-0">
        <div className="relative">
          {/* Baseline - Full width inside card padding */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-dash-border z-0" />

          <div className="flex w-full items-center relative z-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <PerformanceTab
                key={tab}
                label={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-50/30 rounded-3xl border border-dashed border-slate-100">
          <div className="flex flex-col items-center gap-4 text-slate-300">
            <TrendingUp size={64} strokeWidth={1} />
            <p className="font-medium text-sm text-slate-400">
              No performance data available yet
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
