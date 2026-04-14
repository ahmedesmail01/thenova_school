import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { type RawCategory } from "../../courseQueries";

interface CategoryFilterProps {
  categories: RawCategory[];
  selectedSubcategorySlugs?: string[];
  onToggleSubcategory?: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  selectedSubcategorySlugs = [],
  onToggleSubcategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          selectedSubcategorySlugs={selectedSubcategorySlugs}
          onToggleSubcategory={onToggleSubcategory}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  category,
  selectedSubcategorySlugs,
  onToggleSubcategory,
}: {
  category: RawCategory;
  selectedSubcategorySlugs: string[];
  onToggleSubcategory?: (slug: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col border-b border-[#E9EAF0] last:border-b-0">
      <div
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer",
          isOpen ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-5 h-5 object-contain"
            />
          )}
          <span
            className={cn(
              "text-sm text-left truncate max-w-[200px] transition-colors",
              isOpen ? "text-[#1D2026] font-semibold" : "text-[#1D2026]",
            )}
          >
            {category.name}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-brand-blue" />
        ) : (
          <ChevronDown size={18} className="text-[#999DA3]" />
        )}
      </div>

      {isOpen &&
        category.subcategories &&
        category.subcategories.length > 0 && (
          <div className="flex flex-col bg-white overflow-hidden">
            {category.subcategories.map((subcat) => {
              const isSubcatActive = selectedSubcategorySlugs.includes(
                subcat.slug,
              );
              return (
                <div
                  key={subcat.id}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 pl-4 transition-colors cursor-pointer",
                    isSubcatActive ? "bg-[#F0F4F8]" : "hover:bg-[#F5F7FA]",
                  )}
                  onClick={() => onToggleSubcategory?.(subcat.slug)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSubcatActive}
                      readOnly
                      className="w-4 h-4 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
                    />
                    <span
                      className={cn(
                        "text-sm text-left truncate flex-1 transition-colors",
                        isSubcatActive
                          ? "text-brand-blue font-semibold"
                          : "text-[#6B7280]",
                      )}
                    >
                      {subcat.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs text-[#999DA3] transition-colors",
                        isSubcatActive && "text-[#1D2026] font-bold",
                      )}
                    >
                      {subcat.total_courses ?? 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
