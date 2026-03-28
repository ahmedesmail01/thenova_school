# SOP: Nova Group CO. — Frontend Build Guide

> **Stack:** React 18 + Vite + TypeScript · TanStack Router · TanStack Query · Zustand · React Hook Form · Zod · Tailwind CSS

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Design System & Tokens](#2-design-system--tokens)
3. [Routing Architecture](#3-routing-architecture)
4. [Global State (Zustand)](#4-global-state-zustand)
5. [Shared Components Library](#5-shared-components-library)
6. [Page-by-Page Build Guide](#6-page-by-page-build-guide)
   - 6.1 Home / Landing Page
   - 6.2 Login Modal
   - 6.3 Sign Up Wizard (5 Steps)
   - 6.4 Courses Listing Page (Public)
   - 6.5 Course Detail Page
   - 6.6 Courses Listing Page (Authenticated)
   - 6.7 User Profile Dropdown
7. [API Layer (TanStack Query)](#7-api-layer-tanstack-query)
8. [Form Validation Schemas (Zod)](#8-form-validation-schemas-zod)
9. [Responsive Design Rules](#9-responsive-design-rules)
10. [Implementation Sequence](#10-implementation-sequence)

---

## 1. Project Structure

```
src/
├── assets/                  # Static images, logo, icons
├── components/
│   ├── ui/                  # Headless, reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Stepper.tsx
│   │   ├── CourseCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── Pagination.tsx
│   ├── layout/
│   │   ├── Navbar.tsx       # Public nav (Sign up / Login)
│   │   ├── NavbarAuth.tsx   # Authenticated nav (avatar + dropdown)
│   │   └── Footer.tsx
│   └── sections/            # Page-specific composed sections
│       ├── HeroSection.tsx
│       ├── FocusSection.tsx
│       ├── StorySection.tsx
│       ├── PackagesSection.tsx
│       └── EventsSection.tsx
├── pages/
│   ├── Home.tsx
│   ├── CoursesPage.tsx
│   ├── CourseDetailPage.tsx
│   └── DashboardPage.tsx    # Redirect hub for auth users
├── features/
│   ├── auth/
│   │   ├── useAuthStore.ts   # Zustand store
│   │   ├── LoginModal.tsx
│   │   ├── SignUpWizard.tsx
│   │   └── schemas.ts        # Zod schemas
│   └── courses/
│       ├── CourseFilters.tsx
│       ├── courseQueries.ts  # TanStack Query hooks
│       └── schemas.ts
├── lib/
│   ├── api.ts               # Axios/fetch base instance
│   └── utils.ts             # cn(), formatDuration(), etc.
├── routes/                  # TanStack Router route tree
│   ├── __root.tsx
│   ├── index.tsx
│   ├── courses/
│   │   ├── index.tsx
│   │   └── $courseId.tsx
│   └── _auth/               # Layout route: requires auth
│       ├── dashboard.tsx
│       └── courses/
│           └── index.tsx
└── main.tsx
```

---

## 2. Design System & Tokens

Add these tokens to `tailwind.config.ts`. All colors are derived from the Figma.

```ts
// tailwind.config.ts
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0D1B2A", // page background dark
          blue: "#2B6CB0", // primary CTA blue
          "blue-light": "#4A90D9", // hover state
          "blue-btn": "#4882BE", // button fill
          surface: "#1A2D42", // card / modal background
          border: "#2A3F58", // subtle borders
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9DB5CC",
          muted: "#5C7A96",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0D1B2A 0%, #1A2D42 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.35)",
        modal: "0 8px 48px rgba(0,0,0,0.6)",
      },
    },
  },
};
```

**Typography scale:**

| Token       | Size | Weight | Use              |
| ----------- | ---- | ------ | ---------------- |
| `text-4xl`  | 36px | 700    | Hero headline    |
| `text-3xl`  | 30px | 700    | Section headings |
| `text-xl`   | 20px | 600    | Card titles      |
| `text-base` | 16px | 400    | Body             |
| `text-sm`   | 14px | 400    | Labels, captions |
| `text-xs`   | 12px | 500    | Badges, tags     |

---

## 3. Routing Architecture

Using **TanStack Router** file-based routing.

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-brand-navy text-text-primary">
      <Outlet />
      <Footer />
    </div>
  ),
});
```

```tsx
// src/routes/_auth.tsx  — Protected layout route
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect({ to: "/" });
  },
  component: () => (
    <>
      <NavbarAuth />
      <Outlet />
    </>
  ),
});
```

**Route map:**

| Route                | File                             | Auth Required |
| -------------------- | -------------------------------- | ------------- |
| `/`                  | `routes/index.tsx`               | No            |
| `/courses`           | `routes/courses/index.tsx`       | No            |
| `/courses/$courseId` | `routes/courses/$courseId.tsx`   | No            |
| `/_auth/dashboard`   | `routes/_auth/dashboard.tsx`     | Yes           |
| `/_auth/courses`     | `routes/_auth/courses/index.tsx` | Yes           |

Login and Sign Up are **modals** opened via Zustand state, not separate routes.

---

## 4. Global State (Zustand)

```ts
// src/features/auth/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  sponsorId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Modal control
  loginModalOpen: boolean;
  signupModalOpen: boolean;
  setLoginModalOpen: (v: boolean) => void;
  setSignupModalOpen: (v: boolean) => void;
  // Auth actions
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginModalOpen: false,
      signupModalOpen: false,
      setLoginModalOpen: (v) =>
        set({ loginModalOpen: v, signupModalOpen: false }),
      setSignupModalOpen: (v) =>
        set({ signupModalOpen: v, loginModalOpen: false }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "nova-auth",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
```

---

## 5. Shared Components Library

### 5.1 Button

```tsx
// src/components/ui/Button.tsx
type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-blue-btn text-white hover:bg-brand-blue-light",
  outline: "border border-white/30 text-white hover:bg-white/10",
  ghost: "text-text-secondary hover:text-white",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
```

### 5.2 Input

```tsx
// src/components/ui/Input.tsx
export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}
      <input
        className={`w-full rounded-lg bg-white px-4 py-3 text-gray-900
          placeholder:text-gray-400 outline-none ring-2 ring-transparent
          focus:ring-brand-blue transition-all
          ${error ? "ring-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
```

### 5.3 Modal

```tsx
// src/components/ui/Modal.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Modal({ open, onClose, children }: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-brand-surface rounded-2xl shadow-modal p-8">
        {children}
      </div>
    </div>,
    document.body,
  );
}
```

### 5.4 Stepper

```tsx
// src/components/ui/Stepper.tsx
// Used in SignUp wizard — 5 steps
export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all
                ${done ? "bg-brand-blue border-brand-blue text-white" : ""}
                ${active ? "border-brand-blue text-brand-blue bg-transparent" : ""}
                ${!done && !active ? "border-brand-border text-text-muted" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${active ? "text-white" : "text-text-muted"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${done ? "bg-brand-blue" : "bg-brand-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### 5.5 CourseCard

```tsx
// src/components/ui/CourseCard.tsx
export function CourseCard({
  course,
  onViewDetails,
  onPackage,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-44 object-cover"
        />
        <Badge className="absolute top-3 left-3">{course.category}</Badge>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>🕐 {course.duration} Hours</span>
          <span>{course.chapters} chapters</span>
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {course.description}
        </p>
        {/* Progress bar */}
        <div className="text-xs text-gray-400">
          Course Status: {course.completedPercent}% Completed
        </div>
        <div className="h-1 rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-brand-blue"
            style={{ width: `${course.completedPercent}%` }}
          />
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 !text-gray-800 !border-gray-300"
            onClick={() => onViewDetails(course.id)}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onPackage(course.id)}
          >
            Package
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5.6 Navbar (Public)

```tsx
// src/components/layout/Navbar.tsx
export function Navbar() {
  const { setLoginModalOpen, setSignupModalOpen } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/90 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <img src="/logo.svg" alt="Nova Group" className="h-8" />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/courses">Packages</NavLink>
          <CoursesDropdown />
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSignupModalOpen(true)}
          >
            Sign up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLoginModalOpen(true)}
          >
            Login
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sr-only">Menu</span>
          {/* Hamburger icon */}
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-brand-surface border-t border-brand-border px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)}>
            Packages
          </NavLink>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)}>
            Courses
          </NavLink>
          <Button
            size="sm"
            onClick={() => {
              setSignupModalOpen(true);
              setMenuOpen(false);
            }}
          >
            Sign up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoginModalOpen(true);
              setMenuOpen(false);
            }}
          >
            Login
          </Button>
        </div>
      )}
    </nav>
  );
}
```

---

## 6. Page-by-Page Build Guide

---

### 6.1 Home / Landing Page

**File:** `src/pages/Home.tsx`

**Sections to build (top to bottom):**

```
<Navbar />
<HeroSection />
<FocusSection />
<StorySection />
<PackagesSection />
<EventsSection />
<Footer />
```

#### HeroSection

```tsx
// src/components/sections/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-hero-gradient pt-16">
      {/* Abstract wave/blob background image */}
      <img
        src="/hero-wave.svg"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Stats badge */}
        <div className="inline-flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full px-4 py-1.5 mb-6 text-sm text-text-secondary">
          <span className="text-white font-bold text-xl">1850+</span> Lessons
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          The Nova Group CO.
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-text-secondary font-light">
          Your next evolution starts here.
        </p>
      </div>
    </section>
  );
}
```

#### FocusSection

Renders the 4 focus cards: Vision, Mission, Objectives, Goals.

```tsx
// src/components/sections/FocusSection.tsx
const FOCUS_ITEMS = [
  {
    label: "Our Vision",
    icon: "👁",
    text: "NOVA Group empowers growth and transformation worldwide...",
  },
  {
    label: "Our Mission",
    icon: "🚀",
    text: "NOVA Group empowers individuals and communities...",
  },
  {
    label: "Our Objectives",
    icon: "📈",
    text: "NOVA Group empowers growth and transformation worldwide...",
  },
  {
    label: "Our Goals",
    icon: "🎯",
    text: "NOVA Group empowers growth and transformation worldwide...",
  },
];

export function FocusSection() {
  return (
    <section className="py-20 px-4 bg-brand-navy">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: label + video placeholder */}
        <div>
          <p className="text-brand-blue font-semibold uppercase tracking-widest text-sm mb-2">
            OUR
          </p>
          <h2 className="text-5xl font-extrabold text-white">FOCUS</h2>
          <div className="mt-6 w-full aspect-video bg-brand-surface rounded-xl flex items-center justify-center">
            <button className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              ▶
            </button>
          </div>
        </div>
        {/* Right: cards */}
        <div className="flex flex-col gap-4">
          {FOCUS_ITEMS.map((item) => (
            <div
              key={item.label}
              className="bg-brand-surface border border-brand-border rounded-xl p-5 flex gap-4"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.label}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### PackagesSection

Renders 5 pricing cards: Essential, Basic, Premium, Pro, Ultimate.

```tsx
const PACKAGES = [
  {
    name: "Essential",
    price: "99",
    period: "Monthly",
    features: [
      "Trade alert",
      "Beginner course",
      "Basics course",
      "Live trading",
      "Live sessions",
    ],
    missing: [
      "Advance course",
      "Expert course",
      "Expert plus course",
      "All scanner",
      "Private sessions",
    ],
  },
  {
    name: "Basic",
    price: "399",
    period: "Annually",
    features: [
      "Trade alert",
      "Beginner course",
      "Basics course",
      "Live sessions",
    ],
    missing: [
      "Live trading",
      "Advance course",
      "Expert course",
      "Expert plus course",
      "All scanner",
      "Private sessions",
    ],
  },
  // ... Premium (749), Pro (1499 – most featured), Ultimate (749)
];

// Layout:
// Mobile: single column, stacked
// Tablet (md): 2-column grid
// Desktop (lg): first 3 in one row, then last 2 centered
```

**Implementation note:** Use a responsive grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for the first 3, then a separate `grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-2xl lg:mx-auto` for Pro and Ultimate.

---

### 6.2 Login Modal

**File:** `src/features/auth/LoginModal.tsx`

**Trigger:** `loginModalOpen` from Zustand store.

```tsx
export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, setSignupModalOpen, login } =
    useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const [showPass, setShowPass] = useState(false);

  const { mutate: loginMutation } = useMutation({
    mutationFn: (data: LoginSchema) => api.post("/auth/login", data),
    onSuccess: ({ user, token }) => {
      login(user, token);
      setLoginModalOpen(false);
    },
  });

  return (
    <Modal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
      {/* Close button top-left */}
      <button
        className="absolute top-4 left-4 text-text-secondary hover:text-white"
        onClick={() => setLoginModalOpen(false)}
      >
        ✕
      </button>
      {/* Logo top-right */}
      <img src="/logo.svg" className="absolute top-4 right-6 h-8" />

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <p className="text-text-secondary text-sm text-center mt-1">
          Welcome back! Please log in to access your account.
        </p>

        <form
          onSubmit={handleSubmit((d) => loginMutation(d))}
          className="mt-6 flex flex-col gap-4"
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter your Email"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Password with show/hide toggle */}
          <div className="relative">
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your Password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 text-gray-400"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          {/* Forgot + Remember row */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="rounded"
                {...register("rememberMe")}
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-sm text-brand-blue hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don't have an account?{" "}
          <button
            className="text-white underline"
            onClick={() => setSignupModalOpen(true)}
          >
            Sign Up ↗
          </button>
        </p>
      </div>
    </Modal>
  );
}
```

---

### 6.3 Sign Up Wizard (5 Steps)

**File:** `src/features/auth/SignUpWizard.tsx`

The wizard has **5 steps**. Manage current step in local state (or a Zustand slice).

```tsx
const STEPS = [
  "Sponsor ID",
  "Confirm Sponsor ID",
  "Account Details",
  "Create Pin Code",
  "Review",
];

export function SignUpWizard() {
  const { signupModalOpen, setSignupModalOpen, setLoginModalOpen } =
    useAuthStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SignUpData>>({});

  const next = (data: Partial<SignUpData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  return (
    <Modal open={signupModalOpen} onClose={() => setSignupModalOpen(false)}>
      <button
        className="absolute top-4 left-4 text-text-secondary hover:text-white"
        onClick={() => setSignupModalOpen(false)}
      >
        ✕
      </button>
      <img src="/logo.svg" className="absolute top-4 right-6 h-8" />

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-white text-center">Sign Up</h2>
        <p className="text-text-secondary text-sm text-center mt-1">
          Enter your details to create your member account
        </p>

        <div className="mt-6 overflow-x-auto pb-2">
          <Stepper steps={STEPS} current={step} />
        </div>

        {/* Step content */}
        {step === 0 && <StepSponsorId onNext={next} />}
        {step === 1 && (
          <StepConfirmSponsorId data={formData} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <StepAccountDetails data={formData} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <StepCreatePin data={formData} onNext={next} onBack={back} />
        )}
        {step === 4 && (
          <StepReview data={formData as SignUpData} onBack={back} />
        )}

        <p className="text-center text-sm text-text-secondary mt-4">
          Already have an account?{" "}
          <button
            className="text-white underline"
            onClick={() => setLoginModalOpen(true)}
          >
            Login ↗
          </button>
        </p>
      </div>
    </Modal>
  );
}
```

#### Step 0 — Sponsor ID

```tsx
function StepSponsorId({
  onNext,
}: {
  onNext: (d: { sponsorId: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({ sponsorId: z.string().min(1, "Sponsor ID is required") }),
    ),
  });
  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 mt-4">
      <Input
        label="Sponsor ID *"
        placeholder="Enter your Sponsor ID"
        error={errors.sponsorId?.message}
        {...register("sponsorId")}
      />
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" className="flex-1" disabled>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}
```

#### Step 1 — Confirm Sponsor ID

Calls `GET /sponsors/:id` via TanStack Query to validate and show sponsor name.

```tsx
function StepConfirmSponsorId({ data, onNext, onBack }) {
  const [confirmed, setConfirmed] = useState(false);
  const { data: sponsor } = useQuery({
    queryKey: ["sponsor", data.sponsorId],
    queryFn: () => api.get(`/sponsors/${data.sponsorId}`),
  });

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="text-text-secondary text-sm text-center">
        Are you sure you want to join under the Sponsor ID:{" "}
        <strong className="text-white">{data.sponsorId}</strong>?
      </p>
      {sponsor && (
        <p className="text-sm text-text-secondary">
          Sponsor: <span className="text-white">{sponsor.name}</span>
        </p>
      )}
      <label className="flex items-center gap-3 p-4 bg-white rounded-lg cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="w-5 h-5 accent-brand-blue"
        />
        <span className="text-gray-800 font-medium">
          Yes, I confirm this sponsor ID
        </span>
      </label>
      <div className="flex gap-3 mt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!confirmed}
          onClick={() => onNext({})}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

#### Step 2 — Account Details

Contains the full form: profile image, sponsorId (prefilled), first name, last name, username, phone (with country code selector), email, password, confirm password.

```tsx
function StepAccountDetails({ data, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccountDetailsSchema>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: { sponsorId: data.sponsorId },
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="flex flex-col gap-4 mt-4 max-h-[60vh] overflow-y-auto pr-1"
    >
      {/* Profile image upload */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-border overflow-hidden flex-shrink-0">
          {avatarPreview ? (
            <img src={avatarPreview} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              👤
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-text-primary block mb-1">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("avatar")}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setAvatarPreview(URL.createObjectURL(f));
            }}
            className="text-sm text-text-secondary file:mr-2 file:rounded file:border-0 file:bg-brand-blue file:px-3 file:py-1 file:text-white"
          />
        </div>
      </div>

      <Input
        label="Sponsor ID *"
        {...register("sponsorId")}
        error={errors.sponsorId?.message}
      />

      {/* Two columns on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="Enter your Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name *"
          placeholder="Enter your Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Username *"
        placeholder="Enter Username"
        {...register("username")}
        error={errors.username?.message}
      />

      {/* Phone number with country code */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary">
          Phone Number *
        </label>
        <div className="flex gap-2">
          <Controller
            name="countryCode"
            control={control}
            render={({ field }) => (
              <select
                className="rounded-lg bg-white px-3 py-3 text-gray-900 text-sm"
                {...field}
              >
                <option value="+20">🇪🇬 +20</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+1">🇺🇸 +1</option>
                {/* more countries */}
              </select>
            )}
          />
          <input
            className="flex-1 rounded-lg bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="Phone number"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-400">{errors.phone.message}</p>
        )}
      </div>

      <Input
        label="Email *"
        type="email"
        placeholder="Enter your Email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Password *"
        type="password"
        placeholder="Enter your Password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password *"
        type="password"
        placeholder="Confirm your Password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <div className="flex gap-3 mt-2 sticky bottom-0 bg-brand-surface pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}
```

#### Step 3 — Create PIN Code

```tsx
function StepCreatePin({ onNext, onBack }) {
  const [pin, setPin] = useState(["", "", "", ""]);

  const handlePinChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    if (val && i < 3) document.getElementById(`pin-${i + 1}`)?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <p className="text-text-secondary text-sm text-center">
        Create a 4-digit PIN to secure your account
      </p>
      <div className="flex gap-4">
        {pin.map((v, i) => (
          <input
            key={i}
            id={`pin-${i}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handlePinChange(i, e.target.value)}
            className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-white text-gray-900 border-2 border-transparent focus:border-brand-blue outline-none"
          />
        ))}
      </div>
      <div className="flex gap-3 w-full mt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={pin.some((p) => !p)}
          onClick={() => onNext({ pin: pin.join("") })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

#### Step 4 — Review & Submit

```tsx
function StepReview({
  data,
  onBack,
}: {
  data: SignUpData;
  onBack: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const { mutate: register, isPending } = useMutation({
    mutationFn: () => api.post("/auth/register", data),
    onSuccess: ({ user, token }) => {
      useAuthStore.getState().login(user, token);
      useAuthStore.getState().setSignupModalOpen(false);
    },
  });

  const fields = [
    { label: "First Name", value: data.firstName },
    { label: "Last Name", value: data.lastName },
    { label: "User Name", value: data.username },
    { label: "Phone Number", value: data.phone },
    { label: "Email", value: data.email },
    { label: "Sponsor ID", value: data.sponsorId },
  ];

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {fields.map((f) => (
          <p key={f.label} className="text-sm">
            <span className="text-text-muted">{f.label}: </span>
            <span className="text-white font-medium">{f.value}</span>
          </p>
        ))}
      </div>
      <hr className="border-brand-border my-2" />
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-5 h-5 accent-brand-blue"
        />
        <span className="text-sm text-text-secondary">
          I agree to the terms and conditions
        </span>
      </label>
      <div className="flex gap-3 mt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!agreed || isPending}
          onClick={() => register()}
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
```

---

### 6.4 Courses Listing Page (Public)

**File:** `src/pages/CoursesPage.tsx`
**Route:** `/courses`

**Layout (responsive):**

- **Mobile:** Filters collapse into a drawer/accordion. Course grid is single column.
- **Tablet (md):** 2-column grid.
- **Desktop (lg):** Fixed left sidebar (260px) + 2-column course grid.

```tsx
export function CoursesPage() {
  const [filters, setFilters] = useState<CourseFilters>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["courses", filters, page],
    queryFn: () => api.get("/courses", { params: { ...filters, page } }),
  });

  return (
    <>
      <Navbar />
      {/* Hero banner */}
      <div className="relative pt-16 h-52 bg-hero-gradient flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white">Courses</h1>
        <p className="text-text-secondary mt-2">
          Discover the Best Courses to Develop Your Skills
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results header + mobile filter toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-muted text-sm">
            {data?.total?.toLocaleString()} results found for "ui/ux design"
          </p>
          <button
            className="lg:hidden flex items-center gap-2 text-sm text-white border border-brand-border rounded-lg px-3 py-2"
            onClick={() => setMobileFiltersOpen(true)}
          >
            ⚙ Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — hidden on mobile, visible drawer on tablet, fixed on desktop */}
          <aside
            className={`
            lg:block lg:w-64 lg:flex-shrink-0
            ${
              mobileFiltersOpen
                ? "fixed inset-0 z-50 bg-brand-navy overflow-y-auto p-6"
                : "hidden"
            }
          `}
          >
            {mobileFiltersOpen && (
              <button
                className="mb-4 text-white"
                onClick={() => setMobileFiltersOpen(false)}
              >
                ✕ Close
              </button>
            )}
            <CourseFilters filters={filters} onChange={setFilters} />
          </aside>

          {/* Course grid */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <CourseGridSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data?.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewDetails={(id) =>
                      navigate({
                        to: "/courses/$courseId",
                        params: { courseId: id },
                      })
                    }
                    onPackage={(id) => console.log("package", id)}
                  />
                ))}
              </div>
            )}
            <Pagination
              current={page}
              total={data?.totalPages ?? 10}
              onChange={setPage}
              className="mt-8"
            />
          </main>
        </div>
      </div>
    </>
  );
}
```

#### CourseFilters Component

```tsx
// src/features/courses/CourseFilters.tsx
const CATEGORIES = ['Development', 'Business', 'Finance & Accounting', 'IT & Software', 'Office Productivity',
  'Personal Development', 'Design', 'Marketing', 'Lifestyle', 'Photography & Video', 'Music', 'Health & Fitness'];
const TOOLS = ['HTML 5', 'CSS 3', 'React', 'Webflow', 'Node.js', 'Laravel', 'Saas', 'Wordpress'];
const LEVELS = ['All Level', 'Beginner', 'Intermediate', 'Expert'];
const PACKAGES = ['Basic', 'Premium', 'Pro'];
const DURATIONS = ['6-12 Months', '3-6 Months', '1-3 Months', '1-4 Weeks', '1-7 Days'];

// Each group is a collapsible AccordionGroup
export function CourseFilters({ filters, onChange }) {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <FilterGroup label="CATEGORY" items={CATEGORIES} selected={filters.categories} onToggle={...} />
      <FilterGroup label="TOOLS"    items={TOOLS}      selected={filters.tools}      onToggle={...} />
      <FilterGroup label="COURSE LEVEL" items={LEVELS} selected={filters.levels}    onToggle={...} />
      <FilterGroup label="PACKAGES" items={PACKAGES}   selected={filters.packages}   onToggle={...} />
      <FilterGroup label="DURATION" items={DURATIONS}  selected={filters.durations}  onToggle={...} />
    </div>
  );
}

function FilterGroup({ label, items, selected, onToggle }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button className="flex items-center justify-between w-full font-semibold text-text-primary uppercase tracking-wide mb-3"
        onClick={() => setOpen(!open)}>
        {label}
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={selected?.includes(item) ?? false}
                  onChange={() => onToggle(item)} className="accent-brand-blue" />
                <span className="text-text-secondary">{item}</span>
              </span>
              <span className="text-text-muted text-xs">1345</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 6.5 Course Detail Page

**File:** `src/routes/courses/$courseId.tsx`

```tsx
export function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => api.get(`/courses/${courseId}`),
  });
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Back link */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/courses"
            className="text-text-secondary text-sm hover:text-white flex items-center gap-1"
          >
            ← Back to All Courses
          </Link>
        </div>

        {/* Hero banner: video thumbnail + course info */}
        <div className="bg-brand-navy border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Video thumbnail */}
            <div className="w-full md:w-96 flex-shrink-0 aspect-video bg-brand-surface rounded-xl overflow-hidden relative">
              <img
                src={course?.thumbnail}
                className="w-full h-full object-cover"
              />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl">
                  ▶
                </div>
              </button>
            </div>
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{course?.title}</h1>
              <p className="text-text-secondary mt-3 leading-relaxed">
                {course?.description}
              </p>
              <p className="text-3xl font-bold text-white mt-4">
                ${course?.price}
              </p>
              <Button
                className="mt-4 w-full sm:w-auto"
                variant={isAuthenticated ? "primary" : "outline"}
                onClick={() =>
                  !isAuthenticated &&
                  useAuthStore.getState().setLoginModalOpen(true)
                }
              >
                {isAuthenticated ? "Enroll Now" : "You are not Eligible"}
              </Button>
            </div>
          </div>
        </div>

        {/* Course details */}
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
          {/* Duration */}
          <section className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Course Duration
            </h2>
            <p className="text-4xl font-bold text-white">{course?.duration}</p>
          </section>

          {/* What You'll Learn */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              What You Will Learn
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {course?.learningOutcomes}
            </p>
          </section>

          {/* Course Content accordion */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-1">
              Course Content
            </h2>
            <p className="text-text-muted text-sm mb-4">
              {course?.moduleCount} Modules | {course?.totalHours} Hours
            </p>
            <div className="flex flex-col gap-2">
              {course?.modules.map((mod) => (
                <details
                  key={mod.id}
                  className="bg-white rounded-xl px-5 py-4 cursor-pointer group"
                >
                  <summary className="flex items-center justify-between font-medium text-gray-800 list-none">
                    <span>{mod.title}</span>
                    <span className="text-text-muted text-sm">
                      {mod.chapterCount} Chapters
                    </span>
                  </summary>
                  <ul className="mt-3 space-y-1">
                    {mod.chapters.map((c) => (
                      <li
                        key={c.id}
                        className="text-sm text-gray-600 py-1 border-t border-gray-100"
                      >
                        {c.title}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          {/* Available For */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              Available for
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-text-muted text-sm mb-2">Packages</p>
                <div className="flex flex-wrap gap-2">
                  {course?.availableForPackages.map((p) => (
                    <span
                      key={p}
                      className="px-4 py-1.5 rounded-full bg-brand-blue text-white text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-text-muted text-sm mb-2">Groups</p>
                <div className="flex flex-wrap gap-2">
                  {course?.availableForGroups.map((g) => (
                    <span
                      key={g}
                      className="px-4 py-1.5 rounded-full bg-brand-blue text-white text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-text-muted text-sm mb-2">
                  Skills You Will Gain
                </p>
                <div className="flex flex-wrap gap-2">
                  {course?.skills.map((s) => (
                    <span
                      key={s}
                      className="px-4 py-1.5 rounded-full bg-brand-blue/20 border border-brand-blue text-brand-blue-light text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Other courses by author — horizontal scroll on mobile */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-1">
              Other Courses Of the Author
            </h2>
            <p className="text-text-muted text-sm mb-4">
              Other courses from the Same publisher
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0">
              {course?.relatedCourses.map((c) => (
                <div key={c.id} className="min-w-[260px] sm:min-w-0">
                  <CourseCard
                    course={c}
                    onViewDetails={(id) =>
                      navigate({
                        to: "/courses/$courseId",
                        params: { courseId: id },
                      })
                    }
                    onPackage={() => {}}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
```

---

### 6.6 Courses Listing Page (Authenticated)

**File:** `src/routes/_auth/courses/index.tsx`

Identical to the public courses page with these differences:

1. Uses `NavbarAuth` instead of `Navbar`
2. Shows "Back to Dashboard" link above results
3. Hero section has a **search bar** centered in it
4. Course cards show actual progress percentages from the API

```tsx
// Authenticated courses page differences
export function AuthCoursesPage() {
  return (
    <>
      <NavbarAuth />
      {/* Hero with search */}
      <div className="relative pt-16 h-64 bg-hero-gradient flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">Courses</h1>
        <p className="text-text-secondary mb-6">
          Discover the Best Courses to Develop Your Skills
        </p>
        <div className="relative w-full max-w-xl px-4">
          <input
            className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-3 text-white placeholder:text-text-muted outline-none focus:bg-white/20"
            placeholder="Search ..."
          />
          <button className="absolute right-7 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white">
            🔍
          </button>
        </div>
      </div>

      {/* Back to dashboard */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Link
          to="/_auth/dashboard"
          className="text-text-secondary text-sm hover:text-white flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Same filter + grid layout as public page */}
      {/* ... */}
    </>
  );
}
```

#### NavbarAuth Component

```tsx
// src/components/layout/NavbarAuth.tsx
export function NavbarAuth() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-navy/90 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <img src="/logo.svg" alt="Nova Group" className="h-8" />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <NavLink to="/_auth/dashboard">Home</NavLink>
          <CoursesDropdown />
        </div>

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* <img src={user?.avatarUrl ?? '/default-avatar.png'}
              className="w-9 h-9 rounded-full object-cover border-2 border-brand-border" /> */}
            <span className="hidden sm:block text-sm text-white">
              {user?.firstName}
            </span>
            <span className="text-text-muted text-xs">▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-brand-surface border border-brand-border rounded-xl shadow-modal py-2 z-50">
              {/* Profile preview */}
              <div className="px-4 py-3 border-b border-brand-border">
                <p className="font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5">
                View Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5">
                Dashboard
              </button>
              <hr className="border-brand-border my-1" />
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5"
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
```

---

### 6.7 User Profile Dropdown

See `NavbarAuth` above. The dropdown content (page 10-11 of Figma) shows:

- User avatar (pixel art shown in Figma is just a placeholder)
- Full name: **Maria Aldabea**
- Email: **Maria10@gmail.com**
- Links: View Profile, Dashboard, Logout

---

## 7. API Layer (TanStack Query)

```ts
// src/lib/api.ts
import axios from "axios";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  },
);
```

**Query hooks:**

```ts
// src/features/courses/courseQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const courseKeys = {
  all: () => ["courses"] as const,
  list: (f: CourseFilters, p: number) => [...courseKeys.all(), f, p] as const,
  detail: (id: string) => ["course", id] as const,
};

export function useCourses(filters: CourseFilters, page: number) {
  return useQuery({
    queryKey: courseKeys.list(filters, page),
    queryFn: () => api.get("/courses", { params: { ...filters, page } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => api.get(`/courses/${id}`),
    enabled: !!id,
  });
}
```

---

## 8. Form Validation Schemas (Zod)

```ts
// src/features/auth/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const sponsorIdSchema = z.object({
  sponsorId: z
    .string()
    .min(1, "Sponsor ID is required")
    .regex(/^\d+$/, "Must be numeric"),
});

export const accountDetailsSchema = z
  .object({
    profileImage: z.any().optional(),
    sponsorId: z.string().min(1),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),
    countryCode: z.string().min(1),
    phone: z.string().min(7, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type AccountDetailsSchema = z.infer<typeof accountDetailsSchema>;
```

---

## 9. Responsive Design Rules

Apply these rules consistently across every page:

| Breakpoint | Width    | Layout adjustments                                                  |
| ---------- | -------- | ------------------------------------------------------------------- |
| `base`     | < 640px  | Single column. Hamburger nav. Filter drawer overlay. No sidebar.    |
| `sm`       | ≥ 640px  | 2-col course grid. 2-col account details form. Stepper labels show. |
| `md`       | ≥ 768px  | Modals use `max-w-lg`. Course hero shows landscape layout.          |
| `lg`       | ≥ 1024px | Fixed sidebar in courses. Desktop nav. 3-col package grid.          |
| `xl`       | ≥ 1280px | `max-w-7xl` container kicks in. PackagesSection: 3+2 split.         |

**Key responsive patterns:**

1. **Modals** — Always `max-w-lg w-full` with `p-4` container padding so they don't bleed on mobile.
2. **Sign Up Wizard** — The form inside `StepAccountDetails` must be scrollable (`max-h-[60vh] overflow-y-auto`) on small screens since it's tall.
3. **Stepper** — Hide step labels on mobile (`hidden sm:block`). On very small screens, show only step numbers.
4. **Course grid sidebar** — Hidden on `< lg`. On `md`, becomes a slide-over drawer triggered by a "Filters" button.
5. **Related courses carousel** — `overflow-x-auto` horizontal scroll on mobile, CSS grid on `sm+`.
6. **Navbar** — Hamburger on `< md`. Everything inline on `md+`.
7. **Packages** — First 3 cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Pro + Ultimate in their own `grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto`.
8. **Course detail page** — The hero section stacks vertically on mobile (thumbnail above, info below). Side by side on `md+`.

---

## 10. Implementation Sequence

Follow this order to minimize blocking dependencies:

```
Phase 1 — Foundation (Day 1)
  ✅ Set up Tailwind tokens (tailwind.config.ts)
  ✅ Create lib/api.ts + Zustand auth store
  ✅ Build UI primitives: Button, Input, Modal, Badge, Stepper, Pagination
  ✅ Build layout: Navbar, NavbarAuth, Footer

Phase 2 — Auth flows (Day 1-2)
  ✅ LoginModal (with form validation)
  ✅ SignUpWizard Step 0 (SponsorId)
  ✅ SignUpWizard Step 1 (Confirm)
  ✅ SignUpWizard Step 2 (AccountDetails)
  ✅ SignUpWizard Step 3 (PIN)
  ✅ SignUpWizard Step 4 (Review + Submit)
  ✅ Wire modals into Navbar CTAs

Phase 3 — Landing Page (Day 2)
  ✅ HeroSection
  ✅ FocusSection
  ✅ StorySection
  ✅ PackagesSection
  ✅ EventsSection (photo grid)

Phase 4 — Courses (Day 3)
  ✅ CourseFilters component
  ✅ CourseCard component
  ✅ CourseGridSkeleton (loading state)
  ✅ Public CoursesPage (with filter sidebar + pagination)
  ✅ CourseDetailPage

Phase 5 — Auth routes (Day 3-4)
  ✅ TanStack Router protected layout route
  ✅ Authenticated CoursesPage (with search bar)
  ✅ NavbarAuth + user dropdown
  ✅ Dashboard page (stub)

Phase 6 — Polish (Day 4-5)
  ✅ Error boundaries + 404 page
  ✅ Loading skeletons for all data-fetched areas
  ✅ Toast notifications (success/error on login, signup, etc.)
  ✅ Full responsive QA at 375px, 768px, 1280px, 1440px
  ✅ Accessibility: focus traps in modals, aria-labels, keyboard nav
```

---

> **Notes for the team:**
>
> - Never hard-code colors directly — always use Tailwind tokens defined in `tailwind.config.ts`.
> - Every `useQuery` call must have a `staleTime` set to avoid waterfall re-fetches.
> - The `Modal` component uses a **portal** — always render `<LoginModal />` and `<SignUpWizard />` at the `__root.tsx` level so they're available on every page.
> - The `_auth` prefix in TanStack Router is a **layout route** convention — do not rename it.
> - Country code selector in Step 2 should be populated from a static list in `src/lib/countryCodes.ts` — no API call needed.
