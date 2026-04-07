import { cn } from "../../../../lib/utils";
import { type FilterItem } from "../../courseQueries";

interface CheckboxFilterProps {
  items: FilterItem[];
  selectedIds: (string | number)[];
  onToggle: (id: string | number) => void;
  className?: string;
}

export function CheckboxFilter({
  items,
  selectedIds,
  onToggle,
  className,
}: CheckboxFilterProps) {
  return (
    <div className={cn("px-4 pb-2 flex flex-col gap-3", className)}>
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="w-5 h-5 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
            />
            <span
              className={cn(
                "text-sm transition-colors",
                selectedIds.includes(item.id)
                  ? "text-brand-blue font-medium"
                  : "text-[#4E5566] group-hover:text-brand-blue",
              )}
            >
              {item.name}
            </span>
          </div>
          {item.count !== undefined && (
            <span className="text-xs text-[#999DA3]">
              {item.count.toLocaleString()}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}
