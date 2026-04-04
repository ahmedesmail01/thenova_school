import { COLOR_SCHEMES } from "./types";

interface NodeCardProps {
  fullName: string;
  idCode: number | string;
  userImage?: string | null;
  rankName?: string | null;
  color: "red" | "blue" | "teal";
  onClick: () => void;
  rank?: string;
  userPackage?: string;
  rankIcon?: string | null;
}

export function NodeCard({
  fullName,
  idCode,
  userImage,
  rankName,
  color,
  rank,
  userPackage,
  rankIcon,
  onClick,
}: NodeCardProps) {
  const scheme = COLOR_SCHEMES[color];

  return (
    <div
      onClick={onClick}
      className={`p-1.5 rounded-[24px] bg-white border ${scheme.border} shadow-sm transition-transform hover:scale-[1.02] duration-300 relative z-10 cursor-pointer`}
    >
      <div
        className={`p-6 rounded-[22px] border ${scheme.border} bg-linear-to-br ${scheme.bg} shadow-inner w-56 aspect-4/5 flex flex-col items-center justify-center relative overflow-hidden group`}
      >
        {/* Background Decorative Circular Shapes */}
        <div
          className={`absolute -bottom-20 -left-20 w-[120%] h-[120%] rounded-full ${scheme.shape1} mix-blend-multiply pointer-events-none`}
        />
        <div
          className={`absolute -top-20 -right-20 w-80 h-80 rounded-full ${scheme.shape2} mix-blend-overlay pointer-events-none`}
        />

        {/* Avatar Section */}
        <div className="relative mb-6">
          <div
            className={`absolute -inset-2 rounded-full border-8 ${scheme.avatarRing}`}
          />
          <div className="w-20 h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center shadow-md relative z-10 border-2 border-slate-200/50 overflow-hidden">
            <img
              src={userImage || "/images/game-avatar.png"}
              alt="Avatar"
              className={`w-full h-full object-cover ${!userImage ? "pixelated drop-shadow-sm p-2 object-contain" : ""}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/game-avatar.png";
                (e.target as HTMLImageElement).className =
                  "w-full h-full p-2 object-contain pixelated drop-shadow-sm";
              }}
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center z-10">
          <h3
            className="text-white text-lg font-bold tracking-wide mb-1 drop-shadow-md truncate w-full max-w-[176px]"
            title={fullName || "Unknown"}
          >
            {fullName || "Unknown"}
          </h3>
          {rankName && (
            <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1 px-2 py-0.5 bg-black/20 rounded-full inline-block">
              {rankName}
            </p>
          )}
          <p className="text-white font-normal text-sm opacity-90 mb-1 mt-1">
            ID: {idCode || "--"}
          </p>
          {rank ? (
            <div className="flex flex-col items-center gap-1 mb-1">
              {rankIcon && (
                <img
                  src={rankIcon}
                  alt={rank}
                  className="w-8 h-8 object-contain mb-1 drop-shadow-sm"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-sm leading-tight">
                {rank}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 mb-1">
              <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-sm leading-tight">
                {"non ranked"}
              </p>
            </div>
          )}
          {userPackage ? (
            <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/10 shadow-inner mt-1">
              PKG: {userPackage}
            </p>
          ) : (
            <div className="flex flex-col items-center gap-1 mb-1">
              <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-sm leading-tight">
                {"non package"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
