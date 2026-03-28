import { Settings2, X } from "lucide-react";

interface CommissionFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onReset: () => void;
}

export function CommissionFilters({
  selectedDate,
  onDateChange,
  onReset,
}: CommissionFiltersProps) {
  return (
    <div className="mb-8 pl-4 pt-4 flex items-center gap-4">
      <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        <Settings2 className="w-4 h-4 text-slate-400" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="text-[13px] font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
        />
      </div>

      {selectedDate && (
        <button
          onClick={onReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-xs"
        >
          <X className="w-4 h-4" />
          Reset Filter
        </button>
      )}
    </div>
  );
}
