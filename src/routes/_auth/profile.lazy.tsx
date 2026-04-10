import { createLazyFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  PlayCircle,
  Briefcase,
  X,
  Clock,
  FileText,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useUserData } from "../../features/auth/useUserData";
import { cn } from "../../lib/utils";
import OtherCourses from "../../features/courses/OtherCourses";
import { useCourses, useUserEnrollments } from "../../features/courses/courseQueries";

export const Route = createLazyFileRoute("/_auth/profile")({
  component: ProfileRouteComponent,
});

function ProfileRouteComponent() {
  const { data, isLoading, error } = useUserData();
  const { data: coursesData, isLoading: coursesLoading } = useCourses({}, 1);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useUserEnrollments();

  if (isLoading || coursesLoading || enrollmentsLoading) {
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

  const totalCourses = enrollments.length;
  const inProgress = enrollments.filter((e) => e.progress_percentage > 0 && e.progress_percentage < 100).length;
  const completed = enrollments.filter((e) => e.progress_percentage === 100 || e.enrollment.is_completed).length;
  const notStarted = enrollments.filter((e) => e.progress_percentage === 0 && !e.enrollment.is_completed).length;
  const averageCompletion = totalCourses > 0 ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0) / totalCourses) : 0;

  // Mock stats for the dashboard combined with real data
  const stats = [
    {
      label: "Total Courses",
      value: totalCourses.toString(),
      icon: PlayCircle,
      color: "text-sky-500",
      bgColor: "bg-white",
      cardBg: "bg-[#ecf5fc]",
    },
    {
      label: "Subscribed Courses",
      value: totalCourses.toString(),
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-white",
      cardBg: "bg-[#f0edfe]",
    },
    {
      label: "Course Not Started",
      value: notStarted.toString(),
      icon: X,
      color: "text-slate-500",
      bgColor: "bg-white",
      cardBg: "bg-[#eeeeee]",
    },
    {
      label: "Course In Progress",
      value: inProgress.toString(),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-white",
      cardBg: "bg-[#fdefec]",
    },
    {
      label: "Course Completed",
      value: completed.toString(),
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-white",
      cardBg: "bg-[#ebf8ee]",
    },
    {
      label: "Course Completion %",
      value: `${averageCompletion} %`,
      icon: Trophy,
      color: "text-pink-500",
      bgColor: "bg-white",
      cardBg: "bg-[#fdecf3]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header Area with light blue background */}
      <div className="h-48 bg-[#e3f2fd]/60 w-full" />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-32 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-sm shadow-[0_8px_40px_rgb(0,0,0,0.03)] p-6 lg:p-10 flex flex-col md:flex-row items-center gap-8 border border-white">
          <div className="relative">
            <img
              src={userData?.image || "/images/placeholder-avatar.png"}
              alt={userData?.first_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white "
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
          <ContentCard
            title="Subscribed Course vs Percentage Completion"
            icon={Clock}
          />
          <ContentCard title="Quiz Summary" icon={AlertCircle} />
          <ContentCard title="Recent Courses" icon={PlayCircle} />
          <ContentCard title="Completed Courses" icon={FileText} />
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

function ContentCard({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-white rounded-sm shadow-[0_8px_40px_rgb(0,0,0,0.02)] border border-slate-50 overflow-hidden group hover:shadow-[0_12px_50px_rgb(0,0,0,0.04)] transition-shadow duration-500">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/20">
        <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
          <Icon className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="h-[350px] p-8">
        {/* Placeholder content with a nice gradient/pulse effect */}
        <div className="w-full h-full rounded-2xl bg-neutral-50/80 border-2 border-dashed border-slate-200/60 flex items-center justify-center">
          <p className="text-slate-300 font-medium text-sm italic">
            No data available at the moment
          </p>
        </div>
      </div>
    </div>
  );
}
