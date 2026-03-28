import { type Profile } from "../../auth/useUserData";

interface ReadonlyNetworkInfoProps {
  profile: Profile;
}

export function ReadonlyNetworkInfo({ profile }: ReadonlyNetworkInfoProps) {
  const fields = [
    { label: "Sponsor Name", value: profile.sponsor_name || "N/A" },
    { label: "Sponsor ID", value: String(profile.sponsor_id_code || "N/A") },
    { label: "Subscription", value: profile.subscription || "No Plan" },
    { label: "ID Code", value: String(profile.id_code) },
    { label: "CV", value: String(profile.current_cv) },
    { label: "Status", value: profile.status },
    { label: "Left Leg CV", value: String(profile.total_left_leg_cv) },
    { label: "Right Leg CV", value: String(profile.total_right_leg_cv) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
      {fields.map((field) => (
        <div key={field.label} className="flex flex-col gap-2">
          <label className="text-slate-500 text-[11px] font-semibold tracking-wide">
            {field.label}
          </label>
          <input
            type="text"
            readOnly
            defaultValue={field.value}
            className="w-full border border-slate-100 bg-white rounded-lg px-4 py-3 text-[14px] text-slate-400 focus:outline-none transition-all"
          />
        </div>
      ))}
    </div>
  );
}
