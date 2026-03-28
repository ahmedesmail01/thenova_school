import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { PERIOD_LABELS, PERIODS, type TimePeriod } from "./constants";

interface TimePeriodDropdownProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

export function TimePeriodDropdown({
  selectedPeriod,
  onPeriodChange,
  isDropdownOpen,
  setIsDropdownOpen,
}: TimePeriodDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all border border-white/10 backdrop-blur-md"
      >
        <span>{PERIOD_LABELS[selectedPeriod]}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isDropdownOpen && "rotate-180",
          )}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-100 ring-1 ring-black/5">
          {PERIODS.map((period) => (
            <button
              key={period}
              onMouseDown={(e) => {
                e.stopPropagation();
                onPeriodChange(period);
                setIsDropdownOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between",
                selectedPeriod === period
                  ? "text-blue-400 bg-white/5"
                  : "text-white/70 hover:bg-white/10",
              )}
            >
              {PERIOD_LABELS[period]}
              {selectedPeriod === period && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
