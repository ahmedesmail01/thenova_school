import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { type StrictUserData } from "../../features/auth/useUserData";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  idCode: number | string;
  fullName: string;
  userImage?: string | null;
  rankName?: string | null;
  subscriptionName?: string | null;
  color: "red" | "blue" | "teal";
  userData?: StrictUserData;
}

export function UserModal({
  isOpen,
  onClose,
  idCode,
  fullName,
  userImage,
  rankName,
  subscriptionName,
  color,
  userData,
}: UserModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  // Derive display data from userData when available
  const displayName = userData
    ? `${userData.first_name} ${userData.last_name || ""}`.trim()
    : fullName;
  const username = userData?.username;
  const displayIdCode = userData?.id_code || idCode;
  const status = userData?.status;

  // Image handling — match UserInfoModal pattern
  const isValidSrc =
    (userData?.image || userImage) &&
    (userData?.image || userImage) !== "null" &&
    (userData?.image || userImage) !== "http://localhost/uploads/";
  const imgSrc = isValidSrc
    ? (userData?.image || userImage)!
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || displayName}`;

  // Business stats
  const cv = userData?.member?.current_cv ?? 0;
  const leftVol = userData?.member?.totla_left_volume ?? 0;
  const rightVol = userData?.member?.totla_right_volume ?? 0;

  // Sponsor info
  const sponsorUser = userData?.member?.sponsor?.user;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 nodrag cursor-default transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-4xl p-0 w-full max-w-sm shadow-2xl relative border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="h-32 w-full bg-linear-to-br from-[#1a2d42] to-[#2C5D81] relative flex items-start justify-end p-4">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 mix-blend-overlay -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md z-10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-8 pb-8 pt-0 flex flex-col items-center relative w-full">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-lg bg-white relative -mt-14 z-10 p-1 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={imgSrc}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || displayName}`;
                }}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 text-center w-full">
            <h2
              className="text-2xl font-black text-slate-800 tracking-tight truncate w-full"
              title={displayName || "Unknown"}
            >
              {displayName || "Unknown"}
            </h2>
            {username && (
              <p className="text-slate-400 font-medium mb-3">@{username}</p>
            )}

            <div className="flex justify-center gap-2 mb-2 flex-wrap">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                  ID
                </span>
                <span className="text-sm font-black text-brand-blue-btn">
                  {displayIdCode || "--"}
                </span>
              </div>
              {status && (
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#e6f9f1] border border-[#2db39b]/20">
                  <span className="text-xs font-bold text-[#2db39b] capitalize">
                    {status}
                  </span>
                </div>
              )}
              {rankName && (
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/50">
                  <span className="text-xs font-bold text-amber-700 capitalize">
                    {rankName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-6" />

          {/* Business Stats Grid */}
          {userData && (
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Cur. CV
                </span>
                <span className="text-lg font-black text-slate-700">{cv}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] mb-2">
                  Left Vol
                </span>
                <span className="text-lg font-black text-slate-700">
                  {leftVol}
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ef4444] mb-2">
                  Right Vol
                </span>
                <span className="text-lg font-black text-slate-700">
                  {rightVol}
                </span>
              </div>
            </div>
          )}

          {/* Subscription Row */}
          {subscriptionName && (
            <div className="w-full mt-3">
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Subscription
                </span>
                <span
                  className="text-sm font-extrabold truncate w-full text-[#020617]"
                  title={subscriptionName}
                >
                  {subscriptionName}
                </span>
              </div>
            </div>
          )}

          {/* Sponsor Block */}
          {sponsorUser && (
            <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center p-0.5 border border-slate-100 shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sponsorUser.username}`}
                  className="w-full h-full object-cover rounded-full"
                  alt="Sponsor"
                />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sponsor
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {sponsorUser.first_name} {sponsorUser.last_name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
