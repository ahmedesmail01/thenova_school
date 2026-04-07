import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

// ─── Raw API Types ───────────────────────────────────────────
export interface RawCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface RawInstructor {
  id: number;
  id_code?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RawLesson {
  id: number;
  section_id: number;
  title: string;
  slug: string;
  description: string;
  video_id: string;
  duration: number;
  order: number;
  is_preview: number;
  created_at: string;
  updated_at: string;
}

export interface RawSection {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
  lessons?: RawLesson[];
}

export interface RawCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  duration: number;
  level: number;
  is_published: number;
  instructor_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category?: RawCategory;
  instructor?: RawInstructor;
  skills?: any[];
  sections?: RawSection[];
  related_courses?: RawCourse[];
  available_in_package?: any[];
  // Stats (added by Laravel often)
  completed_percent?: number;
  rating?: number;
  students_count?: number;
}

export interface RawPaginationResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
    first_page_url?: string;
    last_page_url?: string;
    next_page_url?: string;
    prev_page_url?: string;
    path?: string;
    from?: number;
    to?: number;
  };
  filters_applied?: any;
}

export interface CourseFiltersType {
  category_id?: (string | number)[];
  skills?: (string | number)[];
  level?: (string | number)[];
  package_level?: (string | number)[];
  duration_min?: number;
  duration_max?: number;
  search?: string;
  is_published?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface FilterDataResponse {
  categories: RawCategory[];
  skills: any[];
}

// ─── Utility ──────────────────────────────────────────────────
export const formatDuration = (minutes: number) => {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatLevel = (level: number) => {
  const levels: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Expert",
  };
  return levels[level] || "Beginner";
};

const STORAGE_URL = import.meta.env.VITE_API_BASE + "/storage/";

const mapRawCourse = (c: RawCourse): RawCourse => {
  const thumbnail = c.thumbnail?.startsWith("http")
    ? c.thumbnail
    : c.thumbnail?.startsWith("/")
      ? `${import.meta.env.VITE_API_BASE}${c.thumbnail}`
      : `${STORAGE_URL}${c.thumbnail}`;

  return {
    ...c,
    thumbnail: thumbnail || "/images/course-1.png",
  };
};

// ─── Query Keys ───────────────────────────────────────────────
export const courseKeys = {
  all: () => ["courses"] as const,
  list: (f: CourseFiltersType, p: number) =>
    [...courseKeys.all(), f, p] as const,
  detail: (slug: string) => ["course", slug] as const,
  filters: () => ["course-filters"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────

export function useCourseFilters() {
  return useQuery<FilterDataResponse>({
    queryKey: courseKeys.filters(),
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: FilterDataResponse;
      }>("/courses/filters/data");
      return data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export interface CoursesResponse {
  courses: RawCourse[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export function useCourses(filters: CourseFiltersType, page: number) {
  return useQuery<CoursesResponse>({
    queryKey: courseKeys.list(filters, page),
    queryFn: async (): Promise<CoursesResponse> => {
      const { data } = await api.get<RawPaginationResponse<RawCourse>>(
        "/courses",
        {
          params: {
            ...filters,
            page,
          },
        },
      );

      const rawData = data.data;

      return {
        courses: rawData.data.map(mapRawCourse),
        total: rawData.total,
        totalPages: rawData.last_page,
        currentPage: rawData.current_page,
        perPage: rawData.per_page,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(slug: string) {
  return useQuery<RawCourse>({
    queryKey: courseKeys.detail(slug),
    queryFn: async (): Promise<RawCourse> => {
      const { data } = await api.get<{
        success: boolean;
        data: RawCourse;
      }>(`/courses/${slug}`);
      return mapRawCourse(data.data);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
