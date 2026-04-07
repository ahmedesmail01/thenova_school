import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useCourses,
  type CourseFiltersType,
} from "../../features/courses/courseQueries";
import { CourseFilters } from "../../features/courses/CourseFilters";
import { CourseGridSkeleton } from "../../features/courses/CourseGridSkeleton";
import { CourseCard } from "../../components/ui/CourseCard";
import { Pagination } from "../../components/ui/Pagination";
import CoursesHero from "../../components/courses/CoursesHero";

export const Route = createLazyFileRoute("/courses/")({
  component: CoursesPage,
});

function CoursesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CourseFiltersType>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCourses(filters, page);

  const handleFilterChange = (newFilters: CourseFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <>
      <div className="bg-white min-h-screen mt-16">
        {/* Hero banner */}
        <CoursesHero
          onSearch={(q) => handleFilterChange({ ...filters, search: q })}
          initialSearch={filters.search}
        />

        <div className="max-w-7xl bg-white border  mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results header + mobile filter toggle */}
          <div className="flex items-center  justify-between mb-6">
            <p className="text-text-muted text-sm">
              <span className="text-[#1D2026] font-semibold">
                {data?.total?.toLocaleString() ?? "0"}
              </span>{" "}
              {filters.search ? (
                <>
                  results find for{" "}
                  <span className="text-[#1D2026] font-bold">
                    “{filters.search}”
                  </span>
                </>
              ) : (
                "Total courses found"
              )}
            </p>
            <button
              className="lg:hidden text-nowrap mx-1 flex items-center gap-2 text-sm text-white border border-brand-border rounded-lg px-3 py-2 bg-brand-surface  transition-colors"
              onClick={() => setMobileFiltersOpen(true)}
            >
              ⚙ Filters &amp; Categories
            </button>
          </div>

          <div className="flex gap-8 items-start">
            {/* Sidebar */}
            <aside
              className={`lg:block lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-24
              ${
                mobileFiltersOpen
                  ? "fixed inset-0 z-50 bg-white overflow-y-auto p-6"
                  : "hidden"
              }`}
            >
              {mobileFiltersOpen && (
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9EAF0]">
                  <h2 className="text-xl font-bold text-[#1D2026]">Filters</h2>
                  <button
                    className="text-[#1D2026] w-10 h-10 flex items-center justify-center bg-[#F5F7FA] hover:bg-[#E9EAF0] rounded-full transition-colors"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    ✕
                  </button>
                </div>
              )}

              <CourseFilters filters={filters} onChange={handleFilterChange} />
            </aside>

            {/* Mobile overlay backdrop */}
            {mobileFiltersOpen && (
              <div
                className="lg:hidden fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}

            {/* Course grid */}
            <main className="flex-1 min-w-0">
              {isLoading ? (
                <CourseGridSkeleton />
              ) : !data?.courses.length ? (
                <div className="py-24 text-center">
                  <p className="text-6xl mb-4">📚</p>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {data.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onViewDetails={(slug) =>
                        navigate({
                          to: "/courses/$courseId",
                          params: { courseId: slug },
                        })
                      }
                      onPackage={(slug) =>
                        navigate({
                          to: "/courses/$courseId",
                          params: { courseId: slug },
                        })
                      }
                    />
                  ))}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <Pagination
                  current={page}
                  total={data.totalPages}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-10"
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
