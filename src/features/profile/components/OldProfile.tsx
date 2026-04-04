import { createLazyFileRoute } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUserData } from "../../auth/useUserData";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { EditableProfileForm } from "./EditableProfileForm";
import { ReadonlyNetworkInfo } from "./ReadonlyNetworkInfo";

export const Route = createLazyFileRoute("/_auth/profile")({
  component: ProfileRouteComponent,
});

function ProfileRouteComponent() {
  const { data, isLoading, error } = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#295175] animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-100px)] w-full flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
          <p className="text-slate-500">
            We couldn't load your profile information. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-50 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userData = data["user data"];
  const profile = data.profile;

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f8fafc] w-full max-w-[1500px] mx-auto ">
      <div className="bg-white rounded-[26px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50 p-4 lg:p-8 min-h-[80vh] flex flex-col">
        {/* Top Section: Photo | Form | Actions */}
        <div className="flex flex-col xl:flex-row gap-16 pb-16 w-full items-center">
          <div className="shrink-0">
            <ProfileImageUpload image={userData.image} />
          </div>
          <div className="flex-1 w-full max-w-4xl">
            <EditableProfileForm userData={userData} />
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-100 -mx-12 mb-12" />

        {/* Bottom Section: Network Info */}
        <div className="w-full max-w-4xl self-center xl:self-start xl:ml-[300px]">
          <ReadonlyNetworkInfo profile={profile} />
        </div>
      </div>
    </div>
  );
}
