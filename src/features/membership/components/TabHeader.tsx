interface TabHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabHeader({ activeTab, onTabChange }: TabHeaderProps) {
  return (
    <div className="flex items-center justify-center gap-6 mb-16">
      <button
        onClick={() => onTabChange("normal")}
        className={`pb-2 text-[13px] font-semibold transition-all uppercase tracking-wide ${
          activeTab === "normal"
            ? "text-[#335c82] border-b-2 border-[#335c82]"
            : "text-slate-400 border-b-2 border-transparent hover:text-slate-600"
        }`}
      >
        Normal
      </button>
      <button
        onClick={() => onTabChange("nova pro")}
        className={`pb-2 text-[13px] font-semibold transition-all uppercase tracking-wide ${
          activeTab === "nova pro"
            ? "text-[#335c82] border-b-2 border-[#335c82]"
            : "text-slate-400 border-b-2 border-transparent hover:text-slate-600"
        }`}
      >
        Nova Pro
      </button>
    </div>
  );
}
