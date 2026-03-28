import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import api from "../../../lib/api";

const pinSchema = z
  .object({
    current_pin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only digits"),
    new_pin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only digits"),
    confirm_new_pin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only digits"),
  })
  .refine((data) => data.new_pin === data.confirm_new_pin, {
    message: "PINs don't match",
    path: ["confirm_new_pin"],
  });

type PinFormValues = z.infer<typeof pinSchema>;

interface PinResetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (operationId: string) => void;
}

export function PinResetModal({
  open,
  onClose,
  onSuccess,
}: PinResetModalProps) {
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
  });

  const { mutate: requestChange, isPending } = useMutation({
    mutationFn: async (data: PinFormValues) => {
      const response = await api.post("user/pin/request-change", {
        current_pin: data.current_pin,
        new_pin: data.new_pin,
        new_pin_confirmation: data.confirm_new_pin,
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
      let message = "Failed to request PIN change";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response: { data?: { message?: string } };
        };
        message = axiosError.response.data?.message || message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: PinFormValues) => {
    requestChange(data);
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl bg-white">
      <div className="flex flex-col ">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 border-gray-100/50">
          <h2 className="text-[22px] font-bold text-slate-800">Change PIN</h2>
          <button
            onClick={onClose}
            className="text-slate-900 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-3">
              <label className="text-slate-700 text-[15px] font-semibold">
                Current PIN
              </label>
              <div className="relative">
                <input
                  type={showCurrentPin ? "text" : "password"}
                  {...register("current_pin")}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="w-full border border-gray-100 bg-white rounded-md px-6 py-3 text-[16px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gray-200 transition-all shadow-none !bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showCurrentPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.current_pin && (
                <span className="text-red-500 text-[12px]">
                  {errors.current_pin.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-700 text-[15px] font-semibold">
                New PIN
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? "text" : "password"}
                  {...register("new_pin")}
                  placeholder="Enter new 4-digit PIN"
                  maxLength={4}
                  className="w-full border border-gray-100 bg-white rounded-md px-6 py-3 text-[16px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gray-200 transition-all shadow-none !bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showNewPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_pin && (
                <span className="text-red-500 text-[12px]">
                  {errors.new_pin.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-700 text-[15px] font-semibold">
                Confirm PIN
              </label>
              <div className="relative">
                <input
                  type={showConfirmPin ? "text" : "password"}
                  {...register("confirm_new_pin")}
                  placeholder="Confirm new 4-digit PIN"
                  maxLength={4}
                  className="w-full border border-gray-100 bg-white rounded-md px-6 py-3 text-[16px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-gray-200 transition-all shadow-none !bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_new_pin && (
                <span className="text-red-500 text-[12px]">
                  {errors.confirm_new_pin.message}
                </span>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-brand-terquaz to-brand-navy hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all text-[18px] flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating PIN...
                  </>
                ) : (
                  "Update PIN"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
