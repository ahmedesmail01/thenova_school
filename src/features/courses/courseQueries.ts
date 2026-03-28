import { useQuery } from "@tanstack/react-query";
// import api from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────
export interface CourseFiltersType {
  categories?: string[];
  tools?: string[];
  levels?: string[];
  packages?: string[];
  durations?: string[];
  search?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  chapterCount: number;
  chapters: { id: string; title: string }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // e.g. "/images/course-1.png"
  category: string;
  level: string;
  duration: string; // e.g. "12 Hours"
  chapters: number;
  price: number;
  completedPercent: number;
  rating?: number;
  students?: number;
}

export interface CourseDetail extends Course {
  learningOutcomes: string;
  moduleCount: number;
  totalHours: number;
  availableForPackages: string[];
  availableForGroups: string[];
  skills: string[];
  modules: CourseModule[];
  relatedCourses: Course[];
}

export interface CoursesResponse {
  courses: Course[];
  total: number;
  totalPages: number;
}

// ─── Dummy Data (replace with real API later) ─────────────────
const DUMMY_COURSES: Course[] = [
  {
    id: "1",
    title: "Complete UI/UX Design Masterclass",
    description:
      "Master design thinking, wireframing, prototyping, and building beautiful digital experiences in Figma.",
    thumbnail: "/images/course-1.png",
    category: "Design",
    level: "Beginner",
    duration: "12",
    chapters: 48,
    price: 49,
    completedPercent: 65,
    rating: 4.9,
    students: 3200,
  },
  {
    id: "2",
    title: "Full-Stack React & Node.js — Pro Edition",
    description:
      "Build production-ready full-stack web applications from scratch using React, Node, Express and MongoDB.",
    thumbnail: "/images/course-1.png",
    category: "Development",
    level: "Intermediate",
    duration: "45",
    chapters: 120,
    price: 129,
    completedPercent: 20,
    rating: 4.8,
    students: 5800,
  },
  {
    id: "3",
    title: "Financial Freedom — Stocks & Investing",
    description:
      "Learn to analyze markets, build a portfolio, and invest with confidence in equities and ETFs.",
    thumbnail: "/images/course-1.png",
    category: "Finance & Accounting",
    level: "All Level",
    duration: "8",
    chapters: 32,
    price: 29,
    completedPercent: 0,
    rating: 4.6,
    students: 2100,
  },
  {
    id: "4",
    title: "Advanced Digital Marketing Strategy",
    description:
      "Go beyond the basics — SEO, paid ads, email funnels, analytics, and brand building for growth.",
    thumbnail: "/images/course-1.png",
    category: "Marketing",
    level: "Expert",
    duration: "22",
    chapters: 65,
    price: 89,
    completedPercent: 0,
    rating: 4.7,
    students: 4100,
  },
  {
    id: "5",
    title: "Personal Development & Mindset Mastery",
    description:
      "Rewire your mindset, build unbreakable habits, and unlock your full potential in life and career.",
    thumbnail: "/images/course-1.png",
    category: "Personal Development",
    level: "All Level",
    duration: "10",
    chapters: 40,
    price: 39,
    completedPercent: 0,
    rating: 4.9,
    students: 8900,
  },
  {
    id: "6",
    title: "Laravel & PHP — Backend Mastery",
    description:
      "Build secure, scalable REST APIs and web apps using Laravel, MySQL, and modern PHP best practices.",
    thumbnail: "/images/course-1.png",
    category: "IT & Software",
    level: "Intermediate",
    duration: "30",
    chapters: 90,
    price: 99,
    completedPercent: 0,
    rating: 4.7,
    students: 2800,
  },
];

const DUMMY_COURSE_DETAIL: CourseDetail = {
  ...DUMMY_COURSES[0],
  learningOutcomes:
    "By the end of this course you will be able to create stunning, user-centered digital products. You will master design thinking, wireframing with pen & paper, building low and high-fidelity prototypes in Figma, conducting user research, and presenting your work to clients. You will also gain a deep understanding of accessibility standards and design systems.",
  moduleCount: 6,
  totalHours: 12,
  availableForPackages: ["Basic", "Premium", "Pro"],
  availableForGroups: ["Designers", "Product Managers", "Entrepreneurs"],
  skills: [
    "UI Design",
    "UX Research",
    "Figma",
    "Prototyping",
    "User Psychology",
    "Design Systems",
  ],
  modules: [
    {
      id: "m1",
      title: "Introduction to UI/UX Design",
      chapterCount: 6,
      chapters: [
        { id: "c1", title: "What is UI vs UX?" },
        { id: "c2", title: "The Design Thinking Process" },
        { id: "c3", title: "Case Study: Uber Redesign" },
        { id: "c4", title: "Tools Overview: Figma, Adobe XD" },
        { id: "c5", title: "Setting Up Your Workspace" },
        { id: "c6", title: "Module Quiz" },
      ],
    },
    {
      id: "m2",
      title: "Typography & Color Theory",
      chapterCount: 8,
      chapters: [
        { id: "c7", title: "Understanding Type Scales" },
        { id: "c8", title: "Font Pairing Principles" },
        { id: "c9", title: "Color Psychology in UX" },
        { id: "c10", title: "Building a Color Palette" },
        { id: "c11", title: "Contrast & Accessibility (WCAG)" },
        { id: "c12", title: "Dark Mode Design" },
        { id: "c13", title: "Hands-on: Design a Color System" },
        { id: "c14", title: "Module Quiz" },
      ],
    },
    {
      id: "m3",
      title: "Wireframing & Prototyping",
      chapterCount: 10,
      chapters: [
        { id: "c15", title: "Low-Fidelity Sketching" },
        { id: "c16", title: "Building Wireframes in Figma" },
        { id: "c17", title: "Interactive Prototypes" },
        { id: "c18", title: "User Testing Your Prototype" },
        { id: "c19", title: "Iteration Based on Feedback" },
      ],
    },
    {
      id: "m4",
      title: "Design Systems & Component Libraries",
      chapterCount: 8,
      chapters: [
        { id: "c20", title: "What is a Design System?" },
        { id: "c21", title: "Atoms, Molecules, Organisms" },
        { id: "c22", title: "Building Reusable Components" },
      ],
    },
  ],
  relatedCourses: [DUMMY_COURSES[1], DUMMY_COURSES[2], DUMMY_COURSES[3]],
};

// ─── Query Keys ───────────────────────────────────────────────
export const courseKeys = {
  all: () => ["courses"] as const,
  list: (f: CourseFiltersType, p: number) =>
    [...courseKeys.all(), f, p] as const,
  detail: (id: string) => ["course", id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────
export function useCourses(filters: CourseFiltersType, page: number) {
  return useQuery<CoursesResponse>({
    queryKey: courseKeys.list(filters, page),
    queryFn: async (): Promise<CoursesResponse> => {
      try {
        // TODO: Replace with real API call when backend is ready
        // const data = await api.get('/courses', { params: { ...filters, page } });
        // return data.data;

        // ── Dummy data simulation ──
        await new Promise((r) => setTimeout(r, 700));
        let filtered = DUMMY_COURSES;

        if (filters.categories?.length) {
          filtered = filtered.filter((c) =>
            filters.categories!.includes(c.category),
          );
        }
        if (filters.levels?.length) {
          filtered = filtered.filter((c) => filters.levels!.includes(c.level));
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q),
          );
        }

        const pageSize = 6;
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        const courses = filtered.slice(start, start + pageSize);

        return { courses, total, totalPages };
      } catch {
        // Fallback to dummy data if API fails
        return {
          courses: DUMMY_COURSES,
          total: DUMMY_COURSES.length,
          totalPages: 1,
        };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(id: string) {
  return useQuery<CourseDetail>({
    queryKey: courseKeys.detail(id),
    queryFn: async (): Promise<CourseDetail> => {
      try {
        // TODO: Replace with real API call when backend is ready
        // const data = await api.get(`/${id}`);
        // return data.data;

        // ── Dummy data simulation ──
        await new Promise((r) => setTimeout(r, 500));
        const found = DUMMY_COURSES.find((c) => c.id === id);
        if (!found) return DUMMY_COURSE_DETAIL;
        return { ...DUMMY_COURSE_DETAIL, ...found };
      } catch {
        return DUMMY_COURSE_DETAIL;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
