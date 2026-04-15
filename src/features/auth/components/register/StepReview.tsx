import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { Button } from "../../../../components/ui/Button";
import api from "../../../../lib/api";
import { type User } from "../../useAuthStore";
import type { SignUpData } from "../../schemas";

export function StepReview({
  data,
  onBack,
  onSuccess,
}: {
  data: SignUpData;
  onBack: () => void;
  onSuccess: (user: User, token: string) => void;
}) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const {
    mutate: registerMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: () => {
      const formData = new FormData();

      formData.append("first_name", data.firstName ?? "");
      formData.append("last_name", data.lastName ?? "");
      formData.append("email", data.email ?? "");
      formData.append("mobile", data.phone ?? "");
      formData.append("country", data.country ?? "");
      formData.append("password", data.password ?? "");
      formData.append("password_confirmation", data.confirmPassword ?? "");
      formData.append("sponsor_id", String(data.sponsorId ?? ""));
      formData.append("username", data.username ?? "");
      formData.append("pin_code", data.pin ?? "");

      const avatar = data.avatar as File | FileList | undefined;
      const file =
        avatar instanceof FileList
          ? avatar.item(0)
          : avatar instanceof File
            ? avatar
            : null;
      if (file) {
        formData.append("image", file);
      }

      return api.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (response) => {
      const { user, token, status, message } = response.data;

      // If registration succeeded but no automatic login data (user/token) was returned
      if (status && (!user || !token)) {
        toast.success(message || "Registration successful! Please login.");
        navigate({ to: "/login" });
        return;
      }

      // If data is missing but status wasn't explicitly success, let it throw to trigger isError
      if (!user || !token) {
        throw new Error("Invalid response structure from server");
      }

      // Mapping the response to ensure it matches the User interface
      const completeUser: User = {
        id: user.id || Math.random().toString(36).substr(2, 9),
        first_name: user.first_name || data.firstName || "",
        last_name: user.last_name || data.lastName || "",
        username: user.username || data.username || "",
        email: user.email || data.email || "",
        phone: user.phone || data.phone || "",
        avatarUrl: user.avatarUrl,
        sponsorId: user.sponsorId || data.sponsorId || "",
      };
      onSuccess(completeUser, token);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      const msg =
        typeof message === "string"
          ? message
          : message?.image?.[0] ||
            message?.email?.[0] ||
            message?.username?.[0];
      toast.error(msg || "Registration failed. Please check your inputs.");
    },
  });

  const fields = [
    { label: "First Name", value: data.firstName },
    { label: "Last Name", value: data.lastName },
    { label: "User Name", value: data.username },
    {
      label: "Phone Number",
      value: `${data.phone ?? ""}`.trim(),
    },
    { label: "Country", value: data.country },
    { label: "Email", value: data.email },
    { label: "Sponsor ID", value: `${data.sponsorId} (${data.sponsorName})` },
  ];

  return (
    <div className="space-y-8">
      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          Registration failed. Please check your image and other fields.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
        {fields.map((f) => (
          <div key={f.label} className="flex items-baseline gap-2">
            <span className="text-white text-base font-semibold whitespace-nowrap">
              {f.label}:
            </span>
            <span className="text-white/90 text-base font-medium truncate">
              {f.value || "—"}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-white/10" />

      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-6 h-6 rounded bg-white accent-brand-blue"
        />
        <span className="text-base text-white font-medium">
          I agree to the terms and conditions
        </span>
      </label>

      <div className="flex gap-4 pt-8 mx-auto w-full max-w-[480px]">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 shadow-lg hover:shadow-brand-blue/20 transition-all font-semibold"
          disabled={!agreed || isPending}
          onClick={() => registerMutation()}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
