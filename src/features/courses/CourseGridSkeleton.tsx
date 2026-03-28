export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-brand-surface rounded-2xl border border-brand-border h-[400px] overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-white/5" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-white/10 rounded-full w-24" />
            <div className="h-8 bg-white/10 rounded-full w-3/4" />
            <div className="h-4 bg-white/10 rounded-full w-full" />
            <div className="h-4 bg-white/10 rounded-full w-1/2" />
            <div className="pt-6 flex justify-between">
              <div className="h-10 bg-white/10 rounded-xl w-32" />
              <div className="h-10 bg-white/10 rounded-xl w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
