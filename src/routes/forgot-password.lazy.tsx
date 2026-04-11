import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import api from "../lib/api";
const logo = "/images/nova-logo.png";
import { Eye, EyeClosed, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";


const step1Schema = z.object({
  identifier: z.string().min(3, "Email or phone is required"),

const step2Schema = z.object({
  code: z.string().min(4, "Code must be at least 4 characters"),

const step3Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface FindAccountResponse {
  status: boolean;
  message: string | { identifier?: string[] };
  operation_id: string;
  user?: {
    id: number;
    id_code: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    country: string | null;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    phone: string | null;
    status: string;
    image: string | null;
  };
}

interface VerifyOtpResponse {
  status: boolean;
  message: string | Record<string, string[]>;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [operationId, setOperationId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Find Account
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const findAccountMutation = useMutation({
    mutationFn: async (data: Step1Data) => {
      const body = {
        identifier: data.identifier,
      };
      const response = await api.post<FindAccountResponse>(
        "user/find-account",
        body,
      );
      return response.data;
    },
    onSuccess: (res, variables) => {
      if (!res.status) {
        const errorMsg =
          typeof res.message === "string"
            ? res.message
            : Object.values(res.message || {})[0]?.[0] || "Account not found";
        toast.error(errorMsg);
        return;
      }
      setEmailOrPhone(variables.identifier);
      setOperationId(res.operation_id);
      setStep(2);
      toast.success("Verification code sent!");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string | Record<string, string[]>;
          };
        };
      };
      const data = axiosError.response?.data;
      const errorMsg =
        typeof data?.message === "string"
          ? data.message
          : Object.values(data?.message || {})[0]?.[0] || "Account not found";
      toast.error(errorMsg);
    },
  });

  // Step 2: Verify Code
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: Step2Data) => {
      return api.post<VerifyOtpResponse>("user/verify-otp", {
        otp: data.code,
        operation_id: operationId,
      });
    },
    onSuccess: (response) => {
      const res = response.data;
      if (!res.status) {
        const errorMsg =
          typeof res.message === "string"
            ? res.message
            : Object.values(res.message || {})[0]?.[0] ||
              "Invalid verification code";
        toast.error(errorMsg);
        return;
      }
      setStep(3);
      toast.success("Code verified!");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string | Record<string, string[]>;
          };
        };
      };
      const data = axiosError.response?.data;
      const errorMsg =
        typeof data?.message === "string"
          ? data.message
          : Object.values(data?.message || {})[0]?.[0] ||
            "Invalid verification code";
      toast.error(errorMsg);
    },
  });

  // Step 3: Reset Password
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: Step3Data) => {
      return api.post("user/reset-password", {
        password: data.password,
        password_confirmation: data.confirmPassword,
        operation_id: operationId,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Failed to reset password",
      );
    },
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: 'url("/images/Login-bg.png")' }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[12px] font-poppins p-8 pt-2 pb-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] bg-linear-to-b from-brand-terquaz to-brand-navy">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/login"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back to Login</span>
            </Link>
            <Link to="/" className="flex items-center justify-end">
              <img src={logo} alt="logo" className="w-20" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify Code"}
              {step === 3 && "Reset Password"}
            </h1>
            <p className="text-sm mt-3 tracking-wider text-white/70">
              {step === 1 && "Enter your email or phone to find your account."}
              {step === 2 && `Enter the code sent to ${emailOrPhone}`}
              {step === 3 && "Set your new password below."}
            </p>
          </div>

          {step === 1 && (
            <form
              onSubmit={handleSubmit1((d) => findAccountMutation.mutate(d))}
              className="space-y-6"
            >
              <Input
                label="Email or Phone"
                placeholder="Enter email or phone number"
                error={errors1.identifier?.message}
                {...register1("identifier")}
              />
              <Button
                type="submit"
                className="w-full h-12 shadow-lg shadow-brand-blue/20"
                disabled={findAccountMutation.isPending}
              >
                {findAccountMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Find Account"
                )}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmit2((d) => verifyCodeMutation.mutate(d))}
              className="space-y-6"
            >
              <Input
                label="Verification Code"
                placeholder="Enter 4-digit code"
                error={errors2.code?.message}
                {...register2("code")}
              />
              <Button
                type="submit"
                className="w-full h-12 shadow-lg shadow-brand-blue/20"
                disabled={verifyCodeMutation.isPending}
              >
                {verifyCodeMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handleSubmit3((d) => resetPasswordMutation.mutate(d))}
              className="space-y-5"
            >
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  error={errors3.password?.message}
                  {...register3("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-white transition-colors text-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  error={errors3.confirmPassword?.message}
                  {...register3("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-white transition-colors text-sm"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 shadow-lg shadow-brand-blue/20"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
