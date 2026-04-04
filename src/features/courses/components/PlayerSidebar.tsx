import { Lock, ChevronDown, ChevronUp, PlayCircle, Trophy, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";

interface Chapter {
  id: string;
  title: string;
  duration?: string;
  isCompleted: boolean;
  isLocked: boolean;
  isActive?: boolean;
}

interface Module {
  id: string;
  title: string;
  duration?: string;
  chapterCount?: number;
  chapters: Chapter[];
}

const DUMMY_MODULES: Module[] = [
  {
    id: "m1",
    title: "Lecture 1: Introduction to Quality Management Systems",
    duration: "1 Hour",
    chapterCount: 5,
    chapters: [
      { id: "c1", title: "1. Introduction to Quality Management Systems", duration: "30:00", isCompleted: true, isLocked: false, isActive: true },
      { id: "c2", title: "2. Introduction to Quality Management Systems", duration: "30:00", isCompleted: false, isLocked: true },
    ],
  },
  {
    id: "m2",
    title: "Lecture 1: Introduction to Quality Management Systems",
    duration: "1 Hour",
    chapterCount: 5,
    chapters: [],
  },
  {
    id: "m3",
    title: "Lecture 1: Introduction to Quality Management Systems",
    duration: "1 Hour",
    chapterCount: 5,
    chapters: [],
  }
];

export function PlayerSidebar() {
  const [openModules, setOpenModules] = useState<string[]>(["m1"]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full h-full bg-white border-l border-slate-200 flex flex-col shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#1D2026] font-bold text-xl">Course Contents</h3>
          <div className="w-12 h-12 rounded-full bg-[#A34E24] flex items-center justify-center text-white relative">
             <Trophy size={20} />
             <div className="absolute inset-0 rounded-full border-2 border-orange-200/30" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-[#1A2D3C] text-[10px] font-bold uppercase tracking-wider">
             2/5 COMPLETED
          </p>
          <div className="flex gap-1 h-1.5 w-full">
             <div className="flex-1 bg-[#458FCE] rounded-full" />
             <div className="flex-1 bg-[#458FCE] rounded-full" />
             <div className="flex-1 bg-[#E1E9F4] rounded-full" />
             <div className="flex-1 bg-[#E1E9F4] rounded-full" />
             <div className="flex-1 bg-[#E1E9F4] rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-slate-100">
        {DUMMY_MODULES.map((mod) => (
          <div key={mod.id} className="border-b border-slate-50 last:border-0 border-solid">
            <button
              onClick={() => toggleModule(mod.id)}
              className={cn(
                "w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group",
                openModules.includes(mod.id) && "bg-[#F0F7FF]"
              )}
            >
              <div className="shrink-0">
                 <PlayCircle 
                    size={24} 
                    className={cn(openModules.includes(mod.id) ? "text-[#458FCE]" : "text-slate-300")} 
                 />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[#1D2026] font-bold text-[13px] leading-tight block">
                  {mod.title}
                </span>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <span className="opacity-60">🕒</span> {mod.duration}
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <span className="opacity-60">📖</span> {mod.chapterCount} lessons
                   </div>
                </div>
              </div>
              {openModules.includes(mod.id) ? (
                <ChevronUp className="text-[#458FCE] shrink-0" size={18} />
              ) : (
                <ChevronDown className="text-slate-400 shrink-0" size={18} />
              )}
            </button>

            {openModules.includes(mod.id) && mod.chapters.length > 0 && (
              <div className="bg-white">
                {mod.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    disabled={chapter.isLocked}
                    className={cn(
                      "w-full px-6 py-4 flex items-center justify-between transition-all text-left",
                      chapter.isActive ? "bg-[#F0F7FF]" : "hover:bg-slate-50",
                      chapter.isLocked && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1">
                        <div className="shrink-0">
                           {chapter.isCompleted ? (
                             <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                           ) : chapter.isActive ? (
                             <div className="w-2.5 h-2.5 rounded-full bg-[#458FCE]" />
                           ) : (
                             <Lock className="text-slate-400" size={14} />
                           )}
                        </div>
                        <span className={cn(
                          "text-[13px] font-medium leading-tight",
                          chapter.isActive ? "text-[#1D2026]" : "text-slate-600"
                        )}>
                          {chapter.title}
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold ml-4">
                      {chapter.duration}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-slate-50 flex items-center gap-4">
         <button className="flex-1 h-12 flex items-center justify-center bg-[#F3F4FB] text-[#1D2026] rounded-lg border border-slate-200/50 hover:bg-slate-100 transition-colors">
            <SkipBack size={18} />
         </button>
         <button className="flex-3 h-12 flex items-center justify-center gap-3 bg-[#458FCE] text-white rounded-lg font-bold hover:bg-[#3b7db5] transition-colors shadow-sm">
            <SkipForward size={18} />
            Next
         </button>
      </div>
    </div>
  );
}
