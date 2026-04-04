import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { type UserData } from "../../auth/useUserData";
import api from "../../../lib/api";
import { OtpModal } from "./OtpModal";
import { PasswordResetModal } from "./PasswordResetModal";
import { PinResetModal } from "./PinResetModal";

const profileSchema = z.object({
  username: z.string().max(100).optional().nullable(),
  first_name: z.string().max(100).optional().nullable(),
  last_name: z.string().max(100).optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditableProfileFormProps {
  userData: UserData;
}

export function EditableProfileForm({ userData }: EditableProfileFormProps) {
  const queryClient = useQueryClient();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentOperationId, setCurrentOperationId] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone
        ? userData.phone.startsWith("+")
          ? userData.phone
          : `+20${userData.phone}`
        : "+20",
      country: userData.country,
    },
  });

  const { mutate: requestUpdate, isPending } = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Create payload with only nullable/string/email/max:100 rules as described
      const payload = {
        username: data.username || null,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        email: data.email || null,
        phone: data.phone || null,
        country: data.country || null,
      };
      const response = await api.post("user/profile/request-update", payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.operation_id) {
        setCurrentOperationId(data.operation_id);
        setShowOtpModal(true);
      } else {
        toast.error("Failed to get operation ID from server");
      }
    },
    onError: (error: unknown) => {
      let message = "Failed to request update";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response: { data?: { message?: string } };
        };
        message = axiosError.response.data?.message || message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    requestUpdate(data);
  };

  const handlePasswordResetSuccess = (operationId: string) => {
    setCurrentOperationId(operationId);
    setShowOtpModal(true);
  };

  const handlePinResetSuccess = (operationId: string) => {
    setCurrentOperationId(operationId);
    setShowOtpModal(true);
  };

  const handleOtpSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["userData"] });
    setShowOtpModal(false);
    setCurrentOperationId(null);
    toast.success("Verification successful!");
  };

  return (
    <div className="flex flex-col items-center lg:items-start lg:flex-row-reverse justify-between relative gap-10">
      {/* Action Buttons - Top Right Stacked */}
      <div className=" flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="bg-[#e4ebf3] hover:bg-[#d5e0ec] text-[#3b6082] text-[12px] font-bold px-6 py-2.5 rounded-md transition-colors border border-[#c5d6e6] whitespace-nowrap min-w-[140px]"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={() => setShowPinModal(true)}
          className="bg-[#d7e4f1] hover:bg-[#c9daea] text-[#3b6082] text-[12px] font-bold px-6 py-2.5 rounded-md transition-colors border border-[#c5d6e6] whitespace-nowrap min-w-[140px]"
        >
          Reset PIN
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[11px] font-semibold tracking-wide">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name")}
              placeholder="First Name"
              className="w-full border border-slate-100 rounded-lg px-4 py-3 text-[14px] text-slate-400 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all"
            />
            {errors.first_name && (
              <span className="text-red-500 text-[10px]">
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[11px] font-semibold tracking-wide">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name")}
              placeholder="Last Name"
              className="w-full border border-slate-100 rounded-lg px-4 py-3 text-[14px] text-slate-400 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all"
            />
            {errors.last_name && (
              <span className="text-red-500 text-[10px]">
                {errors.last_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[11px] font-semibold tracking-wide">
              Phone Number
            </label>
            <div className="phone-input-container">
              <PhoneInput
                defaultCountry={
                  userData.country?.toLowerCase() === "egypt" ? "eg" : "eg"
                }
                value={watch("phone") || ""}
                onChange={(phone, meta) => {
                  setValue("phone", phone, { shouldDirty: true });
                  if (meta?.country?.name) {
                    setValue("country", meta.country.name, { shouldDirty: true });
                  }
                }}
                className="w-full"
                forceDialCode
                inputClassName="!flex-1 !w-full !px-4 !py-3 !text-[14px] !text-slate-400 !placeholder:text-slate-300 !focus:outline-none !border !border-slate-100 !rounded-r-lg !h-[46px]"
                countrySelectorStyleProps={{
                  buttonClassName:
                    "!h-[46px] !bg-white !border !border-slate-100 !rounded-l-lg !px-3",
                  dropdownStyleProps: {
                    style: {
                      left: 0,
                      right: "auto",
                    },
                  },
                }}
                style={{
                  display: "flex",
                  width: "100%",
                }}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-[10px]">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[11px] font-semibold tracking-wide">
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              placeholder="Email"
              className="w-full border border-slate-100 rounded-lg px-4 py-3 text-[14px] text-slate-400 placeholder:text-slate-300 focus:outline-none focus:border-[#295175] transition-all overflow-hidden text-ellipsis"
            />
            {errors.email && (
              <span className="text-red-500 text-[10px]">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="bg-[#1f3a53] hover:bg-[#15283b] text-white text-[13px] font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      <PinResetModal
        open={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinResetSuccess}
      />

      {currentOperationId && (
        <OtpModal
          open={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setCurrentOperationId(null);
          }}
          operation_id={currentOperationId}
          onSuccess={handleOtpSuccess}
        />
      )}

      <PasswordResetModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordResetSuccess}
      />
    </div>
  );
}
