import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../../lib/api";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  sponsorId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  loginModalOpen: boolean;
  signupModalOpen: boolean;
  setLoginModalOpen: (v: boolean) => void;
  setSignupModalOpen: (v: boolean) => void;
  setUser: (user: User | null) => void;
  setBootstrapping: (v: boolean) => void;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  loginModalOpen: false,
  signupModalOpen: false,

  setLoginModalOpen: (v) => set({ loginModalOpen: v, signupModalOpen: false }),

  setSignupModalOpen: (v) => set({ signupModalOpen: v, loginModalOpen: false }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setBootstrapping: (v) => set({ isBootstrapping: v }),

  logout: async () => {
    try {
      // Tell the backend to invalidate the session
      await api.post("/logout");
    } catch {
      // Even if the API call fails, still clear local state
      console.error("Logout failed");
    }

    // Clear any JS-readable cookies
    Cookies.remove("XSRF-TOKEN");
    Cookies.remove("laravel_session");

    // Clear local state
    set({
      user: null,
      isAuthenticated: false,
    });

    // Redirect to login
    window.location.href = "/login";
  },

  bootstrap: async () => {
    try {
      const res = await api.get("/user/data");
      const user = res.data?.user ?? res.data;
      set({
        user,
        isAuthenticated: true,
        isBootstrapping: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
    }
  },
}));
