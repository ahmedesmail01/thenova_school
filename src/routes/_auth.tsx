import { useState, useEffect } from "react";
import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuthStore } from "../features/auth/useAuthStore";
import { Sidebar } from "../components/layout/Sidebar";
import { AuthNavbar } from "../components/layout/AuthNavbar";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const state = useAuthStore.getState();

    // If still bootstrapping, wait for it to finish
    if (state.isBootstrapping) {
      await state.bootstrap();
    }

    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-dash-bg flex">
      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isCollapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <AuthNavbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
