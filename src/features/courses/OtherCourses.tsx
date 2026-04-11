import { CourseCard } from "../../components/ui/CourseCard";
import { useNavigate } from "react-router-dom";
import type { RawCourse } from "./courseQueries";

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

  return (
    <section className="pt-12 border-t border-brand-border/10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-[#1D2026]">{title}</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-[#E9EAF0] flex items-center justify-center text-[#999DA3] hover:bg-gray-50 transition-colors">
            ←
          </button>
          <button className="w-10 h-10 rounded-full border border-[#E9EAF0] flex items-center justify-center text-[#458FCE] bg-[#E8F1F8] hover:bg-[#D1E5F3] transition-colors">
            →
          </button>
        </div>
      </div>
      <p className="text-[#999DA3] text-sm mb-10">{subTitle}</p>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0">
        {courses.map((c) => (
          <div key={c.id} className="min-w-[260px] sm:min-w-0">
            <CourseCard
              course={c}
              onViewDetails={(id) => navigate(`/courses/${id}`)}
              onPackage={(id) => navigate(`/courses/${id}`)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OtherCourses;
