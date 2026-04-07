import { cn } from "../../../../lib/utils";
import { type RawCategory } from "../../courseQueries";

interface CategoryFilterProps {
  categories: RawCategory[];
  selectedIds: (string | number)[];
  onToggle: (id: string | number) => void;
}

export function CategoryFilter({
  categories,
  selectedIds,
  onToggle,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  category,
  selectedIds,
  onToggle,
}: {
  category: RawCategory;
  selectedIds: (string | number)[];
  onToggle: (id: string | number) => void;
}) {
  const isActive = selectedIds.includes(category.id);

  return (
    <div className="flex flex-col border-b border-[#E9EAF0] last:border-b-0">
      <div
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer",
          isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
        )}
        onClick={() => onToggle(category.id)}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            readOnly
            className="w-5 h-5 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
          />
          <span
            className={cn(
              "text-sm text-left truncate max-w-[200px] transition-colors",
              isActive ? "text-brand-blue font-semibold" : "text-[#4E5566]",
            )}
          >
            {category.name}
          </span>
        </div>
      </div>
    </div>
  );
}
