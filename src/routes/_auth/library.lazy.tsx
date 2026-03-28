import { createLazyFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../../features/auth/useAuthStore";
import { useCourses } from "../../features/courses/courseQueries";
import { CourseGridSkeleton } from "../../features/courses/CourseGridSkeleton";
import { CourseCard } from "../../components/ui/CourseCard";
import { Badge } from "../../components/ui/Badge";

export const Route = createLazyFileRoute("/_auth/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const { user } = useAuthStore();
  // For the library, we might want to filter by "enrolled" or similar.
  // Using dummy data for now.
  const { data, isLoading } = useCourses({}, 1);

  const ui = (
    <div className="bg-brand-navy min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <Badge variant="primary">My Library</Badge>
            <span className="text-text-muted text-sm tracking-widest uppercase font-bold">
              Evolution in progress
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Your Subscribed Courses
          </h1>
          <p className="text-text-secondary mt-3 max-w-2xl leading-relaxed">
            Welcome back,{" "}
            <span className="text-white font-bold">{user?.first_name}</span>!
            Continue your learning journey where you left off.
          </p>
        </header>

        {isLoading ? (
          <CourseGridSkeleton />
        ) : !data?.courses.length ? (
          <div className="py-24 text-center bg-brand-surface border border-brand-border rounded-2xl shadow-lg shadow-black/20">
            <p className="text-6xl mb-6">🏜️</p>
            <h3 className="text-2xl font-bold text-white mb-2">
              Your library is empty
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
              Explore our wide range of professional courses and start building
              your future today.
            </p>
            <a
              href="/courses"
              className="inline-block px-8 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue/80 transition-all active:scale-95 shadow-lg shadow-brand-blue/20"
            >
              Browse All Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.courses.map((course) => (
              <div key={course.id} className="group">
                <CourseCard course={course} isLibraryView={true} />
                <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-muted px-1">
                  <span>Progress</span>
                  <span className="text-brand-blue-light">45% COMPLETE</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-brand-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full w-[45%] shadow-[0_0_8px_rgba(40,105,255,0.5)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  console.log(ui);

  return <>courses page</>;
}
