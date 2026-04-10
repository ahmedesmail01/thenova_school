import {
  Lock,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Trophy,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import type { EnrolledSection } from "../courseQueries";

interface PlayerSidebarProps {
  sections: EnrolledSection[];
  completedCount?: number;
  totalCount?: number;
  currentLessonSlug?: string;
  onLessonSelect: (slug: string) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function PlayerSidebar({
  sections,
  completedCount = 0,
  totalCount = 0,
  currentLessonSlug,
  onLessonSelect,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: PlayerSidebarProps) {
  const [openModules, setOpenModules] = useState<string[]>([]);

  useEffect(() => {
    if (sections.length > 0 && openModules.length === 0) {
      // Open module that contains the current lesson, or first module
      if (currentLessonSlug) {
        const activeSection = sections.find((s) =>
          s.lessons?.some((l) => l.slug === currentLessonSlug),
        );
        if (activeSection) {
          setOpenModules([activeSection.id.toString()]);
          return;
        }
      }
      setOpenModules([sections[0].id.toString()]);
    }
  }, [sections, currentLessonSlug, openModules.length]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full h-full bg-white border-l border-slate-200 flex flex-col shadow-sm">
      <div className="p-6 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[#1D2026] font-bold text-xl">Course Contents</h3>
          <div className="w-12 h-12 rounded-full bg-[#A34E24] flex items-center justify-center text-white relative">
            <Trophy size={20} />
            <div className="absolute inset-0 rounded-full border-2 border-orange-200/30" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[#1A2D3C] text-[10px] font-bold uppercase tracking-wider">
            {completedCount}/{totalCount} COMPLETED
          </p>
          <div className="flex h-1.5 w-full bg-[#E1E9F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#458FCE] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-slate-100">
        {sections.map((mod) => (
          <div
            key={mod.id}
            className="border-b border-slate-50 last:border-0 border-solid"
          >
            <button
              onClick={() => toggleModule(mod.id.toString())}
              className={cn(
                "w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group",
                openModules.includes(mod.id.toString()) && "bg-[#F0F7FF]",
              )}
            >
              <div className="shrink-0">
                <PlayCircle
                  size={24}
                  className={cn(
                    openModules.includes(mod.id.toString())
                      ? "text-[#458FCE]"
                      : "text-slate-300",
                  )}
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[#1D2026] font-bold text-[13px] leading-tight block">
                  {mod.title}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span className="opacity-60">📖</span>{" "}
                    {mod.lessons?.length || 0} lessons
                  </div>
                </div>
              </div>
              {openModules.includes(mod.id.toString()) ? (
                <ChevronUp className="text-[#458FCE] shrink-0" size={18} />
              ) : (
                <ChevronDown className="text-slate-400 shrink-0" size={18} />
              )}
            </button>

            {openModules.includes(mod.id.toString()) &&
              mod.lessons &&
              mod.lessons.length > 0 && (
                <div className="bg-white">
                  {mod.lessons.map((chapter) => {
                    const isCompleted = chapter.progress?.is_completed;
                    const isActive = chapter.slug === currentLessonSlug;
                    // For dummy behavior we assume no locking implemented from API unless specifically tracked
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => onLessonSelect(chapter.slug)}
                        className={cn(
                          "w-full px-6 py-4 flex items-center justify-between transition-all text-left",
                          isActive ? "bg-[#F0F7FF]" : "hover:bg-slate-50",
                        )}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                            ) : isActive ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#458FCE]" />
                            ) : (
                              <Lock
                                className="text-slate-400 opacity-50"
                                size={14}
                              />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-[13px] font-medium leading-tight",
                              isActive ? "text-[#1D2026]" : "text-slate-600",
                            )}
                          >
                            {chapter.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 flex items-center gap-4 shrink-0">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex-1 h-12 flex items-center justify-center bg-[#F3F4FB] text-[#1D2026] rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex-[3] h-12 flex items-center justify-center gap-3 bg-[#458FCE] text-white rounded-lg font-bold hover:bg-[#3b7db5] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipForward size={18} />
          Next
        </button>
      </div>
    </div>
  );
}
