import { useEffect } from "react";
import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuthStore } from "../features/auth/useAuthStore";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-dash-bg flex flex-col font-poppins">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
