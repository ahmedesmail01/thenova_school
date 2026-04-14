import { cn } from "../../../../lib/utils";
import { type CourseLevel } from "../../courseQueries";

interface LevelFilterProps {
  levels: CourseLevel[];
  selectedValues: (number | string)[];
  onToggle: (value: number) => void;
}

export function LevelFilter({
  levels,
  selectedValues,
  onToggle,
}: LevelFilterProps) {
  return (
    <div className="flex flex-col">
      {levels.map((level) => {
        const isActive = selectedValues.includes(level.value);
        return (
          <div
            key={level.value}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer border-b border-[#E9EAF0] last:border-b-0",
              isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
            )}
            onClick={() => onToggle(level.value)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                readOnly
                className="w-4 h-4 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "text-brand-blue font-semibold" : "text-[#4E5566]",
                )}
              >
                {level.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
