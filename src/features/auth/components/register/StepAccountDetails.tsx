import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Eye, EyeOff, Upload } from "lucide-react";
import {
  type AccountDetailsSchema,
  type SignUpData,
  accountDetailsSchema,
} from "../../schemas";

export function StepAccountDetails({
  data,
  onNext,
  onBack,
}: {
  data: SignUpData;
  onNext: (d: AccountDetailsSchema) => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountDetailsSchema>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      sponsorId: data.sponsorId,
      countryCode: "+20",
      country: data.country || "Egypt",
    },
  });

  const avatarFile = watch("avatar");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("avatar", e.target.files);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 pr-2">
      {/* Profile Image */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white">Profile Image</label>
        <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row bg-white rounded-xl p-3 border border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white/20">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <span className="text-gray-500 text-sm">
              {avatarFile?.[0]?.name || "No file chosen"}
            </span>
          </div>
          <label className="cursor-pointer bg-white border border-brand-blue/30 text-brand-blue px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-blue/5 transition-colors">
            Choose File
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      <Input
        label="Sponsor ID *"
        error={errors.sponsorId?.message}
        {...register("sponsorId")}
        readOnly
        className="bg-white"
        placeholder="Enter your Name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="Enter your Name"
          error={errors.firstName?.message}
          {...register("firstName")}
          className="bg-white"
        />
        <Input
          label="Last Name *"
          placeholder="Enter your last name"
          error={errors.lastName?.message}
          {...register("lastName")}
          className="bg-white"
        />
      </div>

      <Input
        label="Username *"
        placeholder="Enter Username"
        error={errors.username?.message}
        {...register("username")}
        className="bg-white"
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white">Phone Number*</label>
        <div className="phone-input-container">
          <PhoneInput
            defaultCountry="eg"
            value={watch("phone")}
            onChange={(phone, meta) => {
              setValue("phone", phone);
              setValue("country", meta.country.name);
            }}
            className="w-full"
            forceDialCode
            inputClassName="!w-full !h-[48px] !rounded-lg !border-0 !bg-white !text-gray-900 !px-4 !py-3 !outline-none !ring-2 !ring-transparent focus:!ring-brand-blue"
            countrySelectorStyleProps={{
              buttonClassName:
                "!h-[48px] !bg-white !border-0 !rounded-lg !px-3 !ml-2",
              dropdownStyleProps: {
                style: {
                  right: 0,
                  left: "auto",
                },
              },
            }}
            style={{
              flexDirection: "row-reverse",
              display: "flex",
              gap: "8px",
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <Input
        label="Email *"
        type="email"
        placeholder="Enter your Email"
        error={errors.email?.message}
        {...register("email")}
        className="bg-white"
      />

      <div className="space-y-2">
        <Input
          label="Password *"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          error={errors.password?.message}
          className="bg-white"
          {...register("password")}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />

        {/* Password Criteria */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "6+ characters",
              met: (watch("password") || "").length >= 6,
            },
            {
              label: "Uppercase",
              met: /[A-Z]/.test(watch("password") || ""),
            },
            {
              label: "Number",
              met: /[0-9]/.test(watch("password") || ""),
            },
          ].map((criterion) => (
            <div
              key={criterion.label}
              className={`flex items-center gap-1.5 transition-colors ${
                criterion.met ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              <div
                className={`shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                  criterion.met
                    ? "bg-emerald-400 border-emerald-400 text-white"
                    : "border-gray-500"
                }`}
              >
                {criterion.met && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-2.5 h-2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[11px] font-medium whitespace-nowrap">
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Input
        label="Confirm Password *"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Enter your Password"
        error={errors.confirmPassword?.message}
        className="bg-white"
        {...register("confirmPassword")}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />

      <div className="flex gap-4 pt-8 mx-auto w-full max-w-[480px]">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next →
        </Button>
      </div>
    </form>
  );
}
