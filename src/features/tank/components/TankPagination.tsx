import { cn } from "../../../lib/utils";

interface TankPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function TankPagination({
  currentPage,
  lastPage,
  onPageChange,
}: TankPaginationProps) {
  if (lastPage <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-auto pb-12 overflow-x-auto max-w-full px-4 shrink-0">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 min-w-[40px] rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm border border-slate-100 font-bold cursor-pointer"
      >
        &lt;
      </button>

      {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => {
        // Show current, first, last, and neighbors
        if (
          page === 1 ||
          page === lastPage ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center transition-all shadow-sm font-semibold text-base cursor-pointer",
                currentPage === page
                  ? "bg-[#335c82] text-white shadow-md scale-110"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100",
              )}
            >
              {page}
            </button>
          );
        }
        // Show ellipses
        if (
          (page === 2 && currentPage > 3) ||
          (page === lastPage - 1 && currentPage < lastPage - 2)
        ) {
          return (
            <div
              key={page}
              className="w-10 h-10 min-w-[40px] flex items-center justify-center text-slate-400"
            >
              ...
            </div>
          );
        }
        return null;
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="w-10 h-10 min-w-[40px] rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm border border-slate-100 font-bold cursor-pointer"
      >
        &gt;
      </button>
    </div>
  );
}
