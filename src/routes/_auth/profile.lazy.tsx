import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  PlayCircle,
  Briefcase,
  X,
  Clock,
  FileText,
  Trophy,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  useCourseUserProfile,
  useUserData,
  type RecentCourse,
} from "../../features/auth/useUserData";
import { cn } from "../../lib/utils";
import OtherCourses from "../../features/courses/OtherCourses";
import {
  useCourses,
  useUserEnrollments,
  formatDuration,
  formatLevel,
} from "../../features/courses/courseQueries";

export const Route = createLazyFileRoute("/_auth/profile")({
  component: ProfileRouteComponent,
});

const STORAGE_URL = import.meta.env.VITE_API_BASE + "/storage/";

function getThumbnailUrl(thumbnail: string) {
  if (!thumbnail) return "/images/course-1.png";
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${STORAGE_URL}${thumbnail}`;
}

function ProfileRouteComponent() {
  const { data, isLoading, error } = useUserData();
  const { data: courseProfile, isLoading: courseProfileLoading } =
    useCourseUserProfile();

  const { data: coursesData, isLoading: coursesLoading } = useCourses({}, 1);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useUserEnrollments();

  const navigate = useNavigate();

  if (isLoading || coursesLoading || enrollmentsLoading || courseProfileLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#295175] animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-100px)] w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
          <p className="text-slate-500">
            We couldn't load your profile information. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-50 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userData = data["user data"];
  const enrollments = enrollmentsData?.enrollments || [];

  // ── Stats from courseProfile API ─────────────────────────────
  const stats = [
    {
      label: "Total Courses",
      value: courseProfile?.total_courses?.toString() ?? "—",
      icon: PlayCircle,
      color: "text-sky-500",
      cardBg: "bg-[#ecf5fc]",
    },
    {
      label: "Subscribed Courses",
      value: courseProfile?.total_subscribed_courses?.toString() ?? "—",
      icon: Briefcase,
      color: "text-purple-500",
      cardBg: "bg-[#f0edfe]",
    },
    {
      label: "Not Started",
      value: courseProfile?.total_not_started_courses?.toString() ?? "—",
      icon: X,
      color: "text-slate-500",
      cardBg: "bg-[#eeeeee]",
    },
    {
      label: "In Progress",
      value: courseProfile?.total_in_progress_courses?.toString() ?? "—",
      icon: Clock,
      color: "text-orange-500",
      cardBg: "bg-[#fdefec]",
    },
    {
      label: "Completed",
      value: courseProfile?.total_completed_courses?.toString() ?? "—",
      icon: FileText,
      color: "text-green-500",
      cardBg: "bg-[#ebf8ee]",
    },
    {
      label: "Completion %",
      value: `${courseProfile?.courses_completion_percentage ?? 0} %`,
      icon: Trophy,
      color: "text-pink-500",
      cardBg: "bg-[#fdecf3]",
    },
  ];

  const recentCourses = courseProfile?.recent_courses ?? [];
  const completedCourses = courseProfile?.completed_courses ?? [];
  const subscribedVsCompletion =
    courseProfile?.subscribed_courses_vs_percentage_completion;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header */}
      <div className="h-48 bg-[#e3f2fd]/60 w-full" />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-32 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-sm shadow-[0_8px_40px_rgb(0,0,0,0.03)] p-6 lg:p-10 flex flex-col md:flex-row items-center gap-8 border border-white">
          <div className="relative">
            <img
              src={userData?.image || "/images/placeholder-avatar.png"}
              alt={userData?.first_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white"
            />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {userData?.first_name} {userData?.last_name}
            </h1>
            <p className="text-slate-500 font-medium">
              Welcome back, Ready to continue your learning journey!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={cn(
                "p-6 flex items-center gap-4 transition-all duration-300 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                stat.cardBg,
              )}
            >
              <div className="w-12 h-12 bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-50">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-700 leading-tight">
                  {stat.value}
                </span>
                <span className="text-[12px] font-medium text-slate-500">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscribed vs Completion */}
          <ContentCard
            title="Subscribed Course vs Completion"
            icon={Clock}
          >
            {subscribedVsCompletion ? (
              <div className="flex flex-col gap-6 h-full justify-center">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl font-bold text-purple-500">
                      {subscribedVsCompletion.subscribed}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      Subscribed
                    </span>
                  </div>
                  <div className="h-16 w-px bg-slate-100" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl font-bold text-green-500">
                      {subscribedVsCompletion.percentage}%
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      Completion
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Overall Progress</span>
                    <span>{subscribedVsCompletion.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-green-400 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(subscribedVsCompletion.percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </ContentCard>

          {/* Quiz Summary placeholder */}
          <ContentCard title="Quiz Summary" icon={AlertCircle}>
            <EmptyState />
          </ContentCard>

          {/* Recent Courses */}
          <ContentCard title="Recent Courses" icon={PlayCircle}>
            {recentCourses.length > 0 ? (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1">
                {recentCourses.map((course) => (
                  <RecentCourseRow
                    key={course.id}
                    course={course}
                    onClick={() =>
                      navigate({
                        to: "/courses/$slug",
                        params: { slug: course.slug },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </ContentCard>
 
          {/* Completed Courses */}
          <ContentCard title="Completed Courses" icon={FileText}>
            {completedCourses.length > 0 ? (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1">
                {completedCourses.map((course) => (
                  <RecentCourseRow
                    key={course.id}
                    course={course}
                    showCompleted
                    onClick={() =>
                      navigate({
                        to: "/courses/$slug",
                        params: { slug: course.slug },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState label="No completed courses yet" />
            )}
          </ContentCard>
        </div>

        {coursesData?.courses && (
          <OtherCourses
            courses={coursesData.courses.slice(0, 4)}
            title="Recommended Training / Courses"
            subTitle=" "
          />
        )}

        {enrollments.length > 0 && (
          <OtherCourses
            courses={enrollments.slice(0, 4)}
            title="My Enrolled Courses"
            subTitle=" "
          />
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function ContentCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-sm shadow-[0_8px_40px_rgb(0,0,0,0.02)] border border-slate-50 overflow-hidden group hover:shadow-[0_12px_50px_rgb(0,0,0,0.04)] transition-shadow duration-500">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/20">
        <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
          <Icon className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="h-[350px] p-8 flex flex-col justify-center">{children}</div>
    </div>
  );
}

function EmptyState({ label = "No data available at the moment" }: { label?: string }) {
  return (
    <div className="w-full h-full rounded-2xl bg-neutral-50/80 border-2 border-dashed border-slate-200/60 flex items-center justify-center">
      <p className="text-slate-300 font-medium text-sm italic">{label}</p>
    </div>
  );
}

function RecentCourseRow({
  course,
  showCompleted = false,
  onClick,
}: {
  course: RecentCourse;
  showCompleted?: boolean;
  onClick?: () => void;
}) {
  const statusColors: Record<RecentCourse["status"], string> = {
    not_started: "bg-slate-100 text-slate-500",
    in_progress: "bg-orange-50 text-orange-500",
    completed: "bg-green-50 text-green-600",
  };
  const statusLabels: Record<RecentCourse["status"], string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <img
        src={getThumbnailUrl(course.thumbnail)}
        alt={course.title}
        className="w-14 h-10 rounded-lg object-cover shrink-0 border border-slate-100"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/images/course-1.png";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#295175] transition-colors">
          {course.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatLevel(course.level)} · {formatDuration(course.duration)} · {course.last_accessed_at}
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        {showCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                statusColors[course.status],
              )}
            >
              {statusLabels[course.status]}
            </span>
            {course.progress > 0 && (
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#458FCE] rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
