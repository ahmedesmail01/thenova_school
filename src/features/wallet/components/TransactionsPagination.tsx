import { type PaginationMeta } from "../useWalletTransactions";

interface TransactionsPaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TransactionsPagination({
  meta,
  onPageChange,
}: TransactionsPaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  const startPage = Math.max(1, meta.current_page - 2);
  const endPage = Math.min(meta.last_page, startPage + maxVisiblePages - 1);

  // Recalculate startPage if endPage is at the limit to keep maxVisiblePages
  const adjustedStartPage = Math.max(
    1,
    Math.min(startPage, endPage - maxVisiblePages + 1),
  );

  for (let i = adjustedStartPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-auto pt-8 pb-4">
      <button
        disabled={meta.current_page === 1}
        onClick={() => onPageChange(meta.current_page - 1)}
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs disabled:opacity-50"
      >
        &lt;
      </button>

      {adjustedStartPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs"
          >
            1
          </button>
          {adjustedStartPage > 2 && <div className="text-slate-400">...</div>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-semibold text-xs transition-colors ${
            p === meta.current_page
              ? "bg-[#295175] text-white"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      {endPage < meta.last_page && (
        <>
          {endPage < meta.last_page - 1 && (
            <div className="text-slate-400">...</div>
          )}
          <button
            onClick={() => onPageChange(meta.last_page)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs"
          >
            {meta.last_page}
          </button>
        </>
      )}

      <button
        disabled={meta.current_page === meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
