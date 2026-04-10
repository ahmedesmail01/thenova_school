import { Play, Lock, AlertCircle, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  streamUrl?: string;
  poster?: string;
  isLoading?: boolean;
  error?: string | null;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export function VideoPlayer({
  streamUrl,
  poster = "/images/course-1.png",
  isLoading = false,
  error = null,
  onEnded,
}: VideoPlayerProps) {
  // ── Loading state ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-sm font-medium">Loading video…</span>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error) {
    const isNotEnrolled = error.includes("403") || error.includes("enrolled");
    return (
      <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          {isNotEnrolled ? (
            <Lock className="w-10 h-10 text-slate-400" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-400" />
          )}
          <p className="text-sm font-medium text-slate-500 max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  // ── Bunny.net iframe player ───────────────────────────────────
  if (streamUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <iframe
          src={streamUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          scrolling="no"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Lesson video"
          onLoad={() => {
            // proxy onEnded — Bunny iframe doesn't expose native events;
            // progress is tracked server-side via the progress endpoint.
          }}
        />
        {/* invisible overlay to capture onEnded if needed in future via postMessage */}
        <span className="hidden" aria-hidden onAnimationEnd={onEnded} />
      </div>
    );
  }

  // ── Poster / no-video placeholder ────────────────────────────
  return (
    <div className="relative group aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
      <img
        src={poster}
        alt="Video thumbnail"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-[#458FCE] shadow-xl transform transition-all group-hover:scale-110">
          <Play size={28} fill="currentColor" className="translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}
