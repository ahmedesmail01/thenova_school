import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Eye, X } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import api from "../../../lib/api";

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (operationId: string) => void;
}

export function PasswordResetModal({
  open,
  onClose,
  onSuccess,
}: PasswordResetModalProps) {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const { mutate: requestChange, isPending } = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const response = await api.post("user/password/request-change", {
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.operation_id) {
        onSuccess(data.operation_id);
        reset();
        onClose();
      } else {
        toast.error("Failed to get operation ID from server");
      }
    },
    onError: (error: unknown) => {
      let message = "Failed to request password change";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response: { data?: { message?: string } };
        };
        message = axiosError.response.data?.message || message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    requestChange(data);
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl bg-white">
      <div className="flex flex-col ">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-50">
          <h2 className="text-[20px] font-bold text-slate-700">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-slate-900 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 text-[14px] font-semibold">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  {...register("old_password")}
                  placeholder="Password"
                  className="w-full border border-slate-100 rounded-md px-6 py-3 text-[16px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              {errors.old_password && (
                <span className="text-red-500 text-[12px]">
                  {errors.old_password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-600 text-[14px] font-semibold">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  className="w-full border border-slate-100 rounded-md px-6 py-3 text-[16px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-[12px]">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-600 text-[14px] font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  {...register("password_confirmation")}
                  placeholder="Confirm new password"
                  className="w-full border border-slate-100 rounded-md px-6 py-3 text-[16px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              {errors.password_confirmation && (
                <span className="text-red-500 text-[12px]">
                  {errors.password_confirmation.message}
                </span>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-brand-terquaz to-brand-navy hover:bg-[#15283b] text-white font-bold py-3 rounded-lg transition-colors text-[16px] flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
