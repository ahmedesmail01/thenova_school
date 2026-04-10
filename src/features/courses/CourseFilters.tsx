import {
  type CourseFiltersType,
  useCourseFilters,
} from "../../features/courses/courseQueries";
import { FilterSection } from "./components/filters/FilterSection";
import { CategoryFilter } from "./components/filters/CategoryFilter";

interface CourseFiltersProps {
  filters: CourseFiltersType;
  onChange: (f: CourseFiltersType) => void;
}

export function CourseFilters({ filters, onChange }: CourseFiltersProps) {
  const { data: filterData, isLoading } = useCourseFilters();

  const handleToggle = (
    key: keyof CourseFiltersType,
    itemId: string | number,
  ) => {
    const current = (filters[key] as (string | number)[] | undefined) || [];
    const next = current.includes(itemId)
      ? current.filter((i) => i !== itemId)
      : [...current, itemId];
    onChange({ ...filters, [key]: next.length ? next : undefined });
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-[#E9EAF0] text-sm text-[#4E5566]">
        Loading filters...
      </div>
    );
  }

  const categories = filterData?.categories || [];

  return (
    <div className="flex flex-col gap-0 border border-[#E9EAF0]">
      {/* Category Section */}
      <FilterSection title="Category" isOpen={true}>
        <CategoryFilter
          categories={categories}
          selectedSlugs={filters.category_slug || []}
          onToggle={(slug) => handleToggle("category_slug", slug)}
        />
      </FilterSection>
    </div>
  );
}
