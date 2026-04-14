import {
  type RawCourse,
  formatDuration,
} from "../../features/courses/courseQueries";
import { Clock } from "lucide-react";

interface CourseCardProps {
  course: RawCourse;
  onViewDetails?: (slug: string) => void;
  onPackage?: (slug: string) => void;
  isLibraryView?: boolean;
}

export function CourseCard({
  course,
  onViewDetails,
  onPackage,
  isLibraryView = false,
}: CourseCardProps) {
  return (
    <div className="bg-white  rounded-[1rem] p-3 border border-[#E9EAF0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Thumbnail Area */}
      <div className="relative rounded-2xl overflow-hidden aspect-[1.8/1] mb-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes("course-1.png")) {
              target.src = "/images/course-1.png";
            }
          }}
        />
        {/* Category Tag */}
        <div className="absolute bottom-3 left-4 bg-white px-6 py-1.5 shadow-sm rounded-sm">
          <span className="text-brand-blue text-[10px] font-bold uppercase tracking-widest leading-none">
            {course.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header: Title and Time */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-bold text-[#1D2026] text-lg leading-tight line-clamp-2">
            {course.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            <Clock size={16} className="text-[#999DA3]" />
            <span className="text-[#999DA3] text-xs font-medium">
              <span className="text-[#4E5566] font-bold">
                {formatDuration(course.duration)}
              </span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#999DA3] line-clamp-2 leading-relaxed mb-4">
          {course.description}
        </p>

        {/* Status and Progress */}
        <div className="mt-auto">
          <p className="text-[13px] text-[#999DA3] mb-2 font-medium">
            Course Status - <span className="text-[#4E5566]">0 Completed</span>
          </p>
          <div className="h-1.5 w-full bg-[#F5F7FA] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-brand-blue/10 rounded-full transition-all duration-500"
              style={{ width: `${course.completed_percent || 0}%` }}
            />
          </div>

          {/* Actions */}
          {!isLibraryView ? (
            <div className="grid grid-cols-2 gap-3 mb-4 mx-2">
              <button
                onClick={() => onViewDetails?.(course.slug)}
                className="py-3 px-4 bg-[#E8F1F8] text-[#458FCE] font-bold text-sm hover:bg-[#D1E5F3] transition-colors rounded-sm"
              >
                View Details
              </button>
              <button
                onClick={() => onPackage?.(course.slug)}
                className="py-3 px-4 bg-[#458FCE] text-white font-bold text-sm hover:bg-[#2563EB] transition-colors shadow-lg shadow-blue-500/20 rounded-sm"
              >
                Package
              </button>
            </div>
          ) : (
            <button
              onClick={() => onViewDetails?.(course.slug)}
              className="w-full py-3 px-4  bg-[#3B82F6] text-white font-bold text-sm hover:bg-[#2563EB] transition-colors shadow-lg shadow-blue-500/20"
            >
              Continue Learning →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
