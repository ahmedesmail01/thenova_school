import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../features/auth/useAuthStore";

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/courses",
  "/library",
  "/packages",
  "/terms-and-conditions",
  "/privacy-policy",
  "/disclaimer",
  "/cookie-policy",
];

export default function RootLayout() {
  const { pathname } = useLocation();
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isPublicPage =
    PUBLIC_PAGES.includes(pathname) || pathname.startsWith("/courses/");

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy text-text-primary flex flex-col font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      {isPublicPage && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {isPublicPage && <Footer />}
    </div>
  );
}
