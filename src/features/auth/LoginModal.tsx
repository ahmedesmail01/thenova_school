import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "./useAuthStore";
import api from "../../lib/api";
import { loginSchema } from "./schemas";
import type { LoginSchema } from "./schemas";

type LoginResponse = {
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    sponsorId: string;
  };
};

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, setSignupModalOpen, setUser } =
    useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (data: LoginSchema) => api.post("/auth/login", data),

    onSuccess: async (response: AxiosResponse<LoginResponse>) => {
      try {
        // Option 1: backend already returns the user in login response
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          // Option 2: fetch current user after cookie login succeeds
          const meResponse = await api.get("/user/data");
          setUser(meResponse.data.user ?? meResponse.data);
        }

        setLoginModalOpen(false);
      } catch (error) {
        console.error("Failed to fetch authenticated user after login:", error);
      }
    },

    onError: (error: Error) => {
      console.error("Login failed:", error);
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation(data);
  };

  return (
    <Modal
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      className="max-w-md"
    >
      <button
        type="button"
        className="absolute top-4 left-4 text-text-secondary hover:text-white transition-colors"
        onClick={() => setLoginModalOpen(false)}
      >
        ✕
      </button>

      <div className="absolute top-4 right-6">
        <div className="text-xl font-bold text-white tracking-widest">NOVA</div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <p className="text-text-secondary text-sm text-center mt-1 mb-8">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email *"
            type="email"
            placeholder="Enter your Email"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="relative">
            <Input
              label="Password *"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-text-secondary hover:text-white transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-white transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-blue"
                {...register("rememberMe")}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="text-brand-blue-light hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg shadow-lg shadow-brand-blue/20"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-white underline font-semibold hover:text-brand-blue transition-colors"
            onClick={() => {
              setLoginModalOpen(false);
              setSignupModalOpen(true);
            }}
          >
            Sign up ↗
          </button>
        </p>
      </div>
    </Modal>
  );
}
