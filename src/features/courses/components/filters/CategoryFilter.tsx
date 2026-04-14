import { cn } from "../../../../lib/utils";
import { type RawCategory } from "../../courseQueries";

interface CategoryFilterProps {
  categories: RawCategory[];
  selectedSlugs: string[];
  selectedSubcategorySlugs?: string[];
  onToggle: (slug: string) => void;
  onToggleSubcategory?: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  selectedSlugs,
  selectedSubcategorySlugs = [],
  onToggle,
  onToggleSubcategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          selectedSlugs={selectedSlugs}
          selectedSubcategorySlugs={selectedSubcategorySlugs}
          onToggle={onToggle}
          onToggleSubcategory={onToggleSubcategory}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  category,
  selectedSlugs,
  selectedSubcategorySlugs,
  onToggle,
  onToggleSubcategory,
}: {
  category: RawCategory;
  selectedSlugs: string[];
  selectedSubcategorySlugs: string[];
  onToggle: (slug: string) => void;
  onToggleSubcategory?: (slug: string) => void;
}) {
  const isActive = selectedSlugs.includes(category.slug);

  return (
    <div className="flex flex-col border-b border-[#E9EAF0] last:border-b-0">
      <div
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer",
          isActive ? "bg-[#F5F7FA]" : "hover:bg-[#F5F7FA]",
        )}
        onClick={() => onToggle(category.slug)}
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
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="flex flex-col bg-[#FAFAFA] border-t border-[#E9EAF0]">
          {category.subcategories.map((subcat) => {
            const isSubcatActive = selectedSubcategorySlugs.includes(subcat.slug);
            return (
              <div
                key={subcat.id}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 pl-10 transition-colors cursor-pointer border-b border-[#E9EAF0] last:border-b-0",
                  isSubcatActive ? "bg-[#F0F4F8]" : "hover:bg-[#F5F7FA]"
                )}
                onClick={() => onToggleSubcategory?.(subcat.slug)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSubcatActive}
                    readOnly
                    className="w-4 h-4 rounded border-[#D1D5DB] text-brand-blue focus:ring-brand-blue cursor-pointer"
                  />
                  <span
                    className={cn(
                      "text-sm text-left truncate max-w-[180px] transition-colors",
                      isSubcatActive ? "text-brand-blue font-semibold" : "text-[#6B7280]"
                    )}
                  >
                    {subcat.name}
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
