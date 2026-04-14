import {
  type CourseFiltersType,
  useCourseFilters,
} from "../../features/courses/courseQueries";
import { FilterSection } from "./components/filters/FilterSection";
import { CategoryFilter } from "./components/filters/CategoryFilter";
import { PackageFilter } from "./components/filters/PackageFilter";
import { LevelFilter } from "./components/filters/LevelFilter";
import { SkillFilter } from "./components/filters/SkillFilter";

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
  const levelData = filterData?.levels || [];
  const skillData = filterData?.skills || [];
  const packages = filterData?.packages || [];

  return (
    <div className="flex flex-col gap-4 max-h-[calc(95vh-100px)] overflow-y-auto no-scrollbar pb-6 pr-0">
      {/* Category Section */}
      <FilterSection title="Category" isOpen={true}>
        <CategoryFilter
          categories={categories}
          selectedSubcategorySlugs={filters.subcategory_slug || []}
          onToggleSubcategory={(slug) => handleToggle("subcategory_slug", slug)}
        />
      </FilterSection>

      {/* Level Section */}
      {levelData.length > 0 && (
        <FilterSection title="Level" isOpen={true}>
          <LevelFilter
            levels={levelData}
            selectedValues={filters.level || []}
            onToggle={(val) => handleToggle("level", val)}
          />
        </FilterSection>
      )}

      {/* Skills Section */}
      {skillData.length > 0 && (
        <FilterSection title="Skills" isOpen={true}>
          <SkillFilter
            skills={skillData}
            selectedIds={filters.skills || []}
            onToggle={(id) => handleToggle("skills", id)}
          />
        </FilterSection>
      )}

      {/* Package Section */}
      {packages.length > 0 && (
        <FilterSection title="Packages" isOpen={false}>
          <PackageFilter
            packages={packages}
            selectedIds={filters.package_id || []}
            onToggle={(id) => handleToggle("package_id", id)}
          />
        </FilterSection>
      )}
    </div>
  );
}
