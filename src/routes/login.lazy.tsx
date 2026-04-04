import { createLazyFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../features/auth/useAuthStore";
import api from "../lib/api";
import { loginSchema } from "../features/auth/schemas";
import type { LoginSchema } from "../features/auth/schemas";
import logo from "../../public/images/nova-logo.png";
import { Eye, EyeClosed } from "lucide-react";
import { getCookie } from "../lib/getCookie";

export const Route = createLazyFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  const redirectParam = search.redirect || "/profile";
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate: loginMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (data: LoginSchema) => {
      await getCookie();
      return api.post("/login", {
        email: data.email,
        password: data.password,
        remember: data.rememberMe,
      });
    },

    onSuccess: async (response) => {
      try {
        // if backend returns user directly
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          // otherwise fetch current authenticated user from cookie session
          const meResponse = await api.get("/user/data");
          setUser(meResponse.data.user ?? meResponse.data);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate({ to: redirectParam as any });
      } catch (error) {
        console.error("Failed to load authenticated user after login:", error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigate({ to: redirectParam as any });
    }
  }, [isAuthenticated, navigate, redirectParam]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: 'url("/images/Login-bg.png")' }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[12px] font-poppins p-8 pt-2 pb-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] bg-linear-to-b from-brand-terquaz to-brand-navy">
          <Link to="/" className="flex items-center justify-end">
            <img src={logo} alt="logo" />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white">Login</h1>
            <p className="text-sm mt-2 tracking-wider">
              Welcome back! Please log in to access your account.
            </p>
          </div>

          {isError && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              Invalid email or password. Please try again.
            </div>
          )}

          <form
            onSubmit={handleSubmit((d) => loginMutation(d))}
            className="space-y-5"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-text-secondary hover:text-white transition-colors text-sm"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-white text-[14px] hover:cursor-pointer hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-white transition-colors select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-blue rounded"
                  {...register("rememberMe")}
                />
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mb-6 text-base shadow-lg shadow-brand-blue/20"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              search={search.redirect ? { redirect: search.redirect } : undefined}
              className="text-white font-semibold hover:text-brand-blue-light transition-colors underline underline-offset-2"
            >
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
