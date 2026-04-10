import { createLazyFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "../features/courses/components/VideoPlayer";
import { PlayerSidebar } from "../features/courses/components/PlayerSidebar";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Info, Globe, FileText, Loader2 } from "lucide-react";
import { useEnrolledLesson, useEnrolledLessons, useUpdateLessonProgress, useLessonStream } from "../features/courses/courseQueries";

export const Route = createLazyFileRoute("/player")({
  component: PlayerPage,
});

function PlayerPage() {
  const search = useSearch({ strict: false }) as { courseSlug?: string; lessonSlug?: string };
  const navigate = useNavigate();
  const courseSlug = search.courseSlug;
  const lessonSlug = search.lessonSlug;

  const { data: sectionsData, isLoading: isSectionsLoading } = useEnrolledLessons(courseSlug);
  const { data: lessonData, isLoading: isLessonLoading } = useEnrolledLesson(courseSlug, lessonSlug);
  const updateProgress = useUpdateLessonProgress();

  // Fetch signed Bunny.net stream URL once we have the lesson ID
  const lessonId = lessonData?.lesson?.id;
  const {
    data: streamData,
    isLoading: isStreamLoading,
    error: streamError,
  } = useLessonStream(lessonId);

  const streamErrorMessage = streamError
    ? (streamError as { response?: { status?: number } }).response?.status === 403
      ? "You are not enrolled in this course."
      : (streamError as { response?: { status?: number } }).response?.status === 404
      ? "This video is still being processed. Check back shortly."
      : "Could not load video. Please try again."
    : null;

  const handleLessonSelect = (slug: string) => {
    navigate({ to: "/player", search: { courseSlug, lessonSlug: slug } });
  };

  const handleNext = () => {
    if (!sectionsData?.sections || !lessonSlug) return;
    let found = false;
    let nextSlug = "";
    for (const section of sectionsData.sections) {
      if (!section.lessons) continue;
      for (const lesson of section.lessons) {
        if (found) {
          nextSlug = lesson.slug;
          break;
        }
        if (lesson.slug === lessonSlug) found = true;
      }
      if (nextSlug) break;
    }
    if (nextSlug) {
      handleLessonSelect(nextSlug);
    }
  };

  const handlePrev = () => {
    if (!sectionsData?.sections || !lessonSlug) return;
    let prevSlug = "";
    let found = false;
    for (let i = sectionsData.sections.length - 1; i >= 0; i--) {
      const section = sectionsData.sections[i];
      if (!section.lessons) continue;
      for (let j = section.lessons.length - 1; j >= 0; j--) {
        const lesson = section.lessons[j];
        if (found) {
          prevSlug = lesson.slug;
          break;
        }
        if (lesson.slug === lessonSlug) found = true;
      }
      if (prevSlug) break;
    }
    if (prevSlug) {
      handleLessonSelect(prevSlug);
    }
  };

  const hasNext = () => {
    if (!sectionsData?.sections || !lessonSlug) return false;
    let found = false;
    for (const section of sectionsData.sections) {
      if (!section.lessons) continue;
      for (const lesson of section.lessons) {
        if (found) return true;
        if (lesson.slug === lessonSlug) found = true;
      }
    }
    return false;
  };

  const hasPrev = () => {
    if (!sectionsData?.sections || !lessonSlug) return false;
    let found = false;
    for (let i = sectionsData.sections.length - 1; i >= 0; i--) {
      const section = sectionsData.sections[i];
      if (!section.lessons) continue;
      for (let j = section.lessons.length - 1; j >= 0; j--) {
        const lesson = section.lessons[j];
        if (found) return true;
        if (lesson.slug === lessonSlug) found = true;
      }
    }
    return false;
  };

  // If no lesson slug provided but we have sections, redirect to first lesson
  if (sectionsData?.sections && !lessonSlug) {
    const firstLesson = sectionsData.sections[0]?.lessons?.[0];
    if (firstLesson) {
      navigate({ to: "/player", search: { courseSlug, lessonSlug: firstLesson.slug }, replace: true });
    }
  }

  const handleVideoEnded = () => {
    if (courseSlug && lessonSlug) {
      updateProgress.mutate({
        courseSlug, 
        lessonSlug, 
        progress: { watched_seconds: lessonData?.lesson.duration || 60, is_completed: true }
      });
    }
  };

  const isLoading = isSectionsLoading || (lessonSlug && isLessonLoading);

  // Compute completed / total
  let completedCount = 0;
  let totalCount = 0;
  if (sectionsData?.sections) {
    sectionsData.sections.forEach(s => {
      s.lessons?.forEach(l => {
        totalCount++;
        if (l.progress?.is_completed) completedCount++;
      });
    });
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D2026] font-poppins flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row pt-16">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-32">
             <Loader2 className="w-10 h-10 animate-spin text-[#458FCE]" />
             <p className="mt-4 text-slate-500 font-medium">Loading lecture...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-20 pb-20 space-y-10 scrollbar-hide bg-white">
            <div className="space-y-6 pt-12">
              <Link
                to="/profile"
                className="text-[#4E5566] font-semibold text-[13px] hover:text-[#458FCE] flex items-center gap-2 w-fit transition-all hover:-translate-x-1"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-[32px] font-bold text-[#1D2026] leading-tight max-w-3xl">
                {lessonData?.lesson?.title || "Select a lesson"}
              </h1>
            </div>

            <div className="space-y-6">
              <VideoPlayer
                streamUrl={streamData?.stream_url}
                isLoading={isStreamLoading && !!lessonId}
                error={streamErrorMessage}
                onEnded={handleVideoEnded}
              />

              <div className="flex items-center gap-12 py-1">
                <div className="flex items-center gap-2.5 text-[#4E5566] text-[15px] font-medium">
                  <Info size={16} className="text-slate-400" />
                  <span>Last updated {lessonData?.lesson?.updated_at ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(lessonData.lesson.updated_at)) : "Recently"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#4E5566] text-[15px] font-medium">
                  <Globe size={16} className="text-slate-400" />
                  <span>Arabic</span>
                </div>
              </div>
            </div>

            <div className="space-y-12 pr-0 lg:pr-12">
              <section className="space-y-4">
                <h2 className="text-[22px] font-bold text-[#1D2026]">Overview</h2>
                <p className="text-[#4E5566] text-lg leading-relaxed max-w-4xl font-medium whitespace-pre-wrap">
                  {lessonData?.lesson?.description || "No overview available for this lesson."}
                </p>
              </section>

              <section className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-[22px] font-bold text-[#1D2026]">
                    Certificates
                  </h2>
                  <p className="text-[#4E5566] text-lg font-medium">
                    Get a NOVA certificate upon successful completion of the
                    course
                  </p>
                </div>
                <div className="w-fit p-4 px-8 rounded-lg bg-[#EAF2F9] flex items-center gap-4 group cursor-pointer hover:bg-[#DCE9F5] transition-all">
                  <div className="text-[#458FCE]">
                    <FileText size={22} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#458FCE] font-bold text-[15px]">
                    Certificates
                  </span>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Sidebar Playlist Section */}
        <div className="w-full lg:w-[450px] xl:w-[500px] h-full lg:h-screen lg:sticky lg:top-0 shrink-0">
          <PlayerSidebar 
             sections={sectionsData?.sections || []} 
             currentLessonSlug={lessonSlug}
             completedCount={completedCount}
             totalCount={totalCount}
             onLessonSelect={handleLessonSelect}
             onNext={handleNext}
             onPrev={handlePrev}
             hasNext={hasNext()}
             hasPrev={hasPrev()}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
