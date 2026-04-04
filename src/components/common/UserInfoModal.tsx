import { createPortal } from "react-dom";
import { Loader2, AlertCircle, X } from "lucide-react";
import { useUserByIdData } from "../../features/auth/useUserData";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number | null; // e.g., id_code like 400002
}

export function UserInfoModal({ isOpen, onClose, userId }: UserInfoModalProps) {
  // Pass userId to the strict hook, it will only fetch if userId is truthy
  const { data, isLoading, isError, error } = useUserByIdData(userId);

  if (!isOpen || typeof document === "undefined") return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <Loader2 className="w-10 h-10 animate-spin text-brand-blue-btn mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">
            Loading user profile...
          </p>
        </div>
      );
    }

    if (isError || !data || !data.status) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-700 font-bold mb-2">Error Loading Data</p>
          <p className="text-slate-500 text-sm mb-6">
            {error instanceof Error
              ? error.message
              : data?.message || "Could not fetch user data."}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition-colors text-sm"
          >
            Close
          </button>
        </div>
      );
    }

    const usr = data.user;
    // const initial = usr.first_name ? usr.first_name[0] : usr.username[0];
    const fallbackSrc = `/images/game-avatar.png`;
    // const fallbackSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${usr.username}`;
    const isValidSrc =
      usr.image &&
      usr.image !== "null" &&
      usr.image !== "http://localhost/uploads/";

    // Check rank & volumes from strict member schema
    // Next Rank Logic can go here if provided, but for now we'll just show what's available
    const cv = usr.member.current_cv || 0;
    const lVol = usr.member.totla_left_volume || 0;
    const rVol = usr.member.totla_right_volume || 0;

    return (
      <>
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
          {/* Avatar Section */}
          <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-lg bg-white relative -mt-14 z-10 p-1 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={isValidSrc ? usr.image : fallbackSrc}
                alt={usr.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackSrc;
                }}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 text-center w-full">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {usr.first_name} {usr.last_name || ""}
            </h2>
            <p className="text-slate-400 font-medium mb-3">@{usr.username}</p>

            <div className="flex justify-center gap-2 mb-2">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                  ID
                </span>
                <span className="text-sm font-black text-brand-blue-btn">
                  {usr.id_code}
                </span>
              </div>
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#e6f9f1] border border-[#2db39b]/20">
                <span className="text-xs font-bold text-[#2db39b] capitalize">
                  {usr.status}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-6" />

          {/* Business Stats Grid */}
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
              <span className="text-lg font-black text-slate-700">{lVol}</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ef4444] mb-2">
                Right Vol
              </span>
              <span className="text-lg font-black text-slate-700">{rVol}</span>
            </div>
          </div>

          {/* Sponsor Block */}
          {usr.member.sponsor?.user && (
            <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center p-0.5 border border-slate-100">
                  <img
                    src={`${usr.member.sponsor.user.image ? usr.member.sponsor.user.image : `/images/game-avatar.png`}`}
                    className="w-full h-full object-cover rounded-full"
                    alt="Sponsor"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sponsor
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {usr.member.sponsor.user.first_name}{" "}
                    {usr.member.sponsor.user.last_name}
                  </p>
                </div>
              </div>
              {/* <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue-btn transition-colors" /> */}
            </div>
          )}
        </div>
      </>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 cursor-default transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-4xl p-0 w-full max-w-sm shadow-2xl relative border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>,
    document.body,
  );
}
