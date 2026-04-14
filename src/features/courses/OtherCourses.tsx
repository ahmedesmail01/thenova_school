import { useRef } from "react";
import { CourseCard } from "../../components/ui/CourseCard";
import { useNavigate } from "@tanstack/react-router";
import type { RawCourse } from "./courseQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  title?: string;
  subTitle?: string;
  courses: RawCourse[];
};

const OtherCourses = ({
  title = "Other Courses Of the Author",
  subTitle = "Other courses from the Same publisher",
  courses,
}: Props) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Adjust based on card width

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-12 border-t border-brand-border/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D2026] leading-tight">
          {title}
        </h2>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 rounded-full border border-[#E9EAF0] flex items-center justify-center text-[#999DA3] hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 rounded-full border border-[#E9EAF0] flex items-center justify-center text-[#458FCE] bg-[#E8F1F8] hover:bg-[#D1E5F3] active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <p className="text-[#999DA3] text-sm mb-10">{subTitle}</p>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0 sm:snap-none scroll-smooth"
      >
        {courses.map((c) => (
          <div
            key={c.id}
            className="min-w-full sm:min-w-0 snap-start snap-always"
          >
            <CourseCard
              course={c}
              onViewDetails={(slug) =>
                navigate({
                  to: "/courses/$slug",
                  params: { slug: slug },
                })
              }
              onPackage={(slug) =>
                navigate({
                  to: "/courses/$slug",
                  params: { slug: slug },
                })
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OtherCourses;
