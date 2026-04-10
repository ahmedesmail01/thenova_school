import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useCourse,
  formatDuration,
  useUserEnrollments,
  useEnrollInCourse,
} from "../../features/courses/courseQueries";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";
import OtherCourses from "../../features/courses/OtherCourses";

export const Route = createLazyFileRoute("/courses/$courseId")({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(courseId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: enrollmentsData } = useUserEnrollments();
  const enrollMutation = useEnrollInCourse();

  const isEnrolled =
    isAuthenticated &&
    enrollmentsData?.enrollments.some((e) => e.id === course?.id);

  if (isLoading) {
    return (
      <div className="bg-brand-navy min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-secondary">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <>
      <div className="bg-white p-4 md:px-[100px] min-h-screen text-[#1D2026]">
        <div className="pt-16">
          {/* Back link */}
          <div className="max-w-7xl   py-4">
            <Link
              to="/courses"
              className="text-gray-700 font-semibold text-lg mb-6 hover:text-brand-blue flex items-start  gap-1 w-fit transition-colors"
            >
              ← Back to All Courses
            </Link>
          </div>

          {/* Hero Section */}
          <div className="bg-[#0D1B2A]  overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
              {/* Left: Video Thumbnail (Full Bleed) */}
              <div className="relative group cursor-pointer overflow-hidden order-1">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("course-1.png")) {
                      target.src = "/images/course-1.png";
                    }
                  }}
                />
                {/* Play Button */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center text-[#458FCE] text-2xl shadow-2xl transition-transform group-hover:scale-110">
                    <span className="ml-1.5 font-bold">▶</span>
                  </div>
                </div>
              </div>

              {/* Right: Info Section */}
              <div className="p-8 md:p-16 flex flex-col justify-center order-2">
                <div className="space-y-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                    {course.description}
                  </p>
                  {/* <div className="text-4xl font-bold text-white pt-2">
                    $0
                  </div> */}
                  <div className="pt-4">
                    <Button
                      className="w-full sm:w-auto rounded-lg bg-[#458FCE] hover:bg-[#3b7db5] px-12 py-3.5 text-base font-semibold transition-all shadow-lg"
                      disabled={enrollMutation.isPending}
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate({ to: "/login" });
                          return;
                        }
                        if (isEnrolled) {
                          navigate({ to: "/player", search: { courseSlug: course.slug } });
                        } else {
                          enrollMutation.mutate(course.slug, {
                            onSuccess: () => navigate({ to: "/player", search: { courseSlug: course.slug } }),
                            onError: (error: any) => {
                              const message =
                                error.response?.data?.message ||
                                error.message ||
                                "Failed to enroll.";
                              toast.error(message);
                            },
                          });
                        }
                      }}
                    >
                      {!isAuthenticated
                        ? "You Are Not Eligible"
                        : isEnrolled
                          ? "Continue Course"
                          : enrollMutation.isPending
                            ? "Enrolling..."
                            : "Enroll Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course details */}
          <div className="max-w-full mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
            {/* Duration */}
            <section className="text-center py-16">
              <h2 className="text-[35px] font-bold text-[#1D2026] mb-4">
                Course Duration
              </h2>
              <p className="text-[30px] font-medium text-[#4E5566]">
                {formatDuration(course.duration)}
              </p>
            </section>

            {/* What You'll Learn */}
            <section>
              <h2 className="text-[35px] font-bold text-[#1D2026] mb-6">
                What You Will Learn
              </h2>
              <p className="text-[#4E5566] text-lg max-w-[800px] leading-relaxed">
                {course.description}
              </p>
            </section>

            {/* Course Content */}
            <section className="space-y-8">
              <div>
                <h2 className="text-3xl mb-6 font-bold text-[#1D2026]">
                  Course Content
                </h2>
                <p className="text-[#999DA3] text-sm mt-2">
                  {course.sections?.length || 0} Sections |{" "}
                  {formatDuration(course.duration)} total
                </p>
              </div>

              <div className="flex flex-col ">
                {course.sections?.map((mod) => (
                  <details
                    key={mod.id}
                    className="bg-[#F9F9F9] border border-b border-[#E9EAF0] overflow-hidden group cursor-pointer "
                  >
                    <summary className="flex items-center justify-between px-6 py-5 font-semibold text-[#1D2026] list-none hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 group-open:rotate-180 transition-transform inline-block text-xs">
                          ▼
                        </span>
                        <span className="text-gray-500">{mod.title}</span>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        {mod.lessons?.length || 0} Lessons
                      </span>
                    </summary>
                    <ul className="px-5 pb-4 space-y-1 border-t border-gray-100">
                      {mod.lessons?.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="text-sm text-gray-600 py-2 border-b border-gray-50 last:border-0 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">▸</span>
                            {lesson.title}
                          </div>
                          <span className="text-gray-400 text-xs shrink-0">
                            {formatDuration(lesson.duration)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>

            {/* Available For */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-[#1D2026]">
                Available for
              </h2>

              <div className="space-y-6">
                {course.available_in_package &&
                  course.available_in_package.length > 0 && (
                    <div>
                      <p className="text-[#4E5566] text-sm font-bold mb-3 uppercase tracking-wider">
                        Packages
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {course.available_in_package.map((p) => (
                          <span
                            key={typeof p === "string" ? p : p.name || p.id}
                            className="px-8 py-2.5 rounded-full bg-linear-to-r from-[#458FCE] to-[#1A334B] text-white text-sm font-medium"
                          >
                            {typeof p === "string"
                              ? p
                              : p.name || `Package ${p.id}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <p className="text-[#4E5566] text-sm font-bold mb-3 uppercase tracking-wider">
                    Skills You Will Gain
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {course.skills?.map((s) => (
                      <span
                        key={typeof s === "string" ? s : s.name || s.id}
                        className="px-8 py-2.5 rounded-full bg-linear-to-r from-[#458FCE] to-[#1A334B] text-white text-sm font-medium"
                      >
                        {typeof s === "string" ? s : s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {course.related_courses && (
              <OtherCourses courses={course.related_courses} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
