import React, { useState } from "react";
// ... (imports remain the same)
import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useUserData } from "../../features/auth/useUserData";
import toast from "react-hot-toast";

interface SocialLinkProps {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function SocialIconButton({ icon: Icon, color, bgColor }: SocialLinkProps) {
  return (
    <button
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-lg transition-all active:scale-95",
        bgColor,
        color,
      )}
    >
      <Icon size={20} />
    </button>
  );
}

function ProfileAvatar({ src, username }: { src?: string; username: string }) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [error, setError] = useState(false);

  // Adjust state if the prop changes
  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  const fallbackSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  const isValidSrc = src && src !== "null" && src !== "";

  return (
    <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg overflow-hidden relative z-10 border border-slate-50">
      <img
        src={error || !isValidSrc ? fallbackSrc : src}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
        onError={() => setError(true)}
      />
    </div>
  );
}

import type { DashboardData } from "../../hooks/dashboard/useDashboardData";

interface UserProfileCardProps {
  className?: string;
  data: DashboardData | undefined;
}

export function UserProfileCard({
  className,
  data: dashboardData,
}: UserProfileCardProps) {
  const { data, isLoading, error } = useUserData();
  const sponserCode = data?.profile.id_code;
  // console.log("user data is ", data);
  const handleCopyDomain = () => {
    if (!sponserCode) {
      toast.error("Sponsor code not found");
      return;
    }
    const url = `${window.location.origin}/register?sponsorId=${sponserCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Registration link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white rounded-[20px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]",
          className,
        )}
      >
        <Loader2 className="w-8 h-8 text-brand-blue-btn animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={cn(
          "bg-white rounded-[20px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]",
          className,
        )}
      >
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-slate-500 font-medium mb-4">
          Failed to load profile
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-brand-blue-btn font-bold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const userData = data["user data"];
  const profile = data.profile;

  const user = {
    firstName: userData.first_name,
    lastName: userData.last_name,
    username: userData.username,
    avatarUrl: userData.image,
    status: userData.status || "Active",
    subscription: profile.subscription || "Member",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center h-full relative overflow-hidden",
        className,
      )}
    >
      {/* Top Header Actions */}
      <div className="w-full flex justify-between items-center mb-4 relative z-10">
        <span className="bg-[#e6f9f1] text-[#2db39b] text-[13px] font-bold px-5 py-1.5 rounded-full">
          {user.subscription}
        </span>
        {/* <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue-btn hover:bg-blue-50 transition-colors">
          <Share2 size={18} />
        </button> */}
      </div>

      {/* Avatar Section with Decoration */}
      <div className="relative mb-6">
        {/* Decorative Orbit/Stars */}
        <div className="absolute inset-[-20px] pointer-events-none opacity-20">
          <svg
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-[spin_20s_linear_infinite]"
          >
            <circle
              cx="70"
              cy="70"
              r="62"
              stroke="#4882be"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle cx="20" cy="30" r="3" fill="#4882be" />
            <circle cx="120" cy="110" r="2" fill="#4882be" />
            <path d="M100 20 L104 24 L100 28 L96 24 Z" fill="#4882be" />
          </svg>
        </div>

        <ProfileAvatar src={user.avatarUrl} username={user.username} />
      </div>

      {/* User Info */}
      <div className="space-y-1 mb-6 relative z-10">
        <h3 className="text-[20px] font-bold text-[#1a2d42]">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-slate-400 font-medium">{user.username}</p>
      </div>

      {/* Status Badge */}
      <div className="mb-10 relative z-10">
        <span className="bg-[#2db39b] text-white text-[14px] font-bold px-8 py-2 rounded-full shadow-lg shadow-[#2db39b]/20">
          {dashboardData?.rank?.name || user.status}
        </span>
      </div>

      {/* Domain Section */}
      <div className="w-full space-y-4 mb-10 relative z-10">
        <button className="text-[14px] text-slate-400 font-medium hover:text-brand-blue-btn transition-colors">
          View personalized domain
        </button>

        <button
          onClick={handleCopyDomain}
          className="w-full bg-[#eff1f9] hover:bg-[#e4e8f5] text-brand-blue-btn py-3.5 rounded-xl text-[15px] font-bold transition-all active:scale-[0.98]"
        >
          Copy personalized domain
        </button>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-3 relative z-10">
        <SocialIconButton
          icon={Facebook}
          color="text-[#1877F2]"
          bgColor="bg-[#eff2f5]"
        />
        <SocialIconButton
          icon={Instagram}
          color="text-[#E4405F]"
          bgColor="bg-[#fceef1]"
        />
        <SocialIconButton
          icon={Linkedin}
          color="text-[#0A66C2]"
          bgColor="bg-[#eef4f8]"
        />
        <SocialIconButton
          icon={MessageCircle}
          color="text-[#25D366]"
          bgColor="bg-[#e7faf0]"
        />
      </div>
    </div>
  );
}
