import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  current,
  total,
  onChange,
  className = "",
}: PaginationProps) {
  const getPageRange = () => {
    const range: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta) ||
        (current <= 3 && i <= 4) ||
        (current >= total - 2 && i >= total - 3)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const pages = getPageRange();

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous Button */}
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="w-11 h-11 flex items-center justify-center rounded-lg border border-[#E9EAF0] text-[#9099A8] transition-all hover:border-brand-blue/50 disabled:opacity-30 disabled:hover:border-[#E9EAF0]"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span key={`dots-${idx}`} className="text-[#9099A8] px-1">
              ...
            </span>
          );
        }

        const isPageActive = current === p;

        return (
          <button
            key={`page-${p}`}
            onClick={() => onChange(p as number)}
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-lg border transition-all text-sm font-semibold",
              isPageActive
                ? "border-brand-blue text-brand-blue"
                : "border-[#E9EAF0] text-[#4E5566] hover:border-brand-blue/50"
            )}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-lg transition-all disabled:opacity-30",
          current === total
            ? "border border-[#E9EAF0] text-[#9099A8]"
            : "bg-brand-blue text-white border border-brand-blue hover:bg-brand-blue/90"
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
