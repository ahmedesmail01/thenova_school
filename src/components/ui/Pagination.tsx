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
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  // Basic pagination logic (can be expanded for many pages)
  const visiblePages = pages.slice(
    Math.max(0, current - 3),
    Math.min(total, current + 2),
  );

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-brand-border text-white disabled:opacity-30 hover:bg-white/5 transition-colors"
      >
        ←
      </button>

      {current > 3 && (
        <>
          <button
            onClick={() => onChange(1)}
            className="w-10 h-10 text-text-secondary hover:text-white"
          >
            1
          </button>
          <span className="text-text-muted">...</span>
        </>
      )}

      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-lg border ${
            current === p
              ? "bg-brand-blue border-brand-blue text-white"
              : "border-brand-border text-text-secondary hover:text-white hover:bg-white/5"
          } transition-all font-bold`}
        >
          {p}
        </button>
      ))}

      {current < total - 2 && (
        <>
          <span className="text-text-muted">...</span>
          <button
            onClick={() => onChange(total)}
            className="w-10 h-10 text-text-secondary hover:text-white"
          >
            {total}
          </button>
        </>
      )}

      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-brand-border text-white disabled:opacity-30 hover:bg-white/5 transition-colors"
      >
        →
      </button>
    </div>
  );
}
