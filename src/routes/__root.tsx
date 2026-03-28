import { useEffect } from "react";
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { NotFoundPage } from "../components/NotFoundPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../features/auth/useAuthStore";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  const { location } = useRouterState();
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Define public pages that should have the default navbar/footer
  const publicPages = ["/", "/about", "/courses", "/library"];
  const isPublicPage =
    publicPages.includes(location.pathname) ||
    location.pathname.startsWith("/courses/");

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
      {/* Show Navbar only on public pages when not logged in, or if explicitly requested */}
      {isPublicPage && <Navbar />}

      {/* For authenticated dashboard, we don't show the root navbar/footer 
          as AuthLayout handles it */}
      <main className="flex-1">
        <Outlet />
      </main>

      {isPublicPage && <Footer />}

      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}

