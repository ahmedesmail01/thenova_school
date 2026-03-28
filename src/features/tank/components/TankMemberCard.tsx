import { Loader2 } from "lucide-react";
import { type TankMember, usePlaceMember } from "../useUserTank";

interface TankMemberCardProps {
  member: TankMember;
}

export function TankMemberCard({ member }: TankMemberCardProps) {
  const { mutate: placeMember, isPending } = usePlaceMember();

  const handlePlace = (placement: "left" | "right") => {
    placeMember({ referralId: member.member_id, placement });
  };

  const fullName = `${member.member_firstname} ${member.member_lastname}`;

  return (
    <div className="bg-linear-to-br from-[#264157] to-[#1b3145] rounded-xl overflow-hidden shadow-lg mx-auto md:mx-0 w-full max-w-[384px] md:max-w-3/4 relative">
      {/* Background Styling / Geometric Slices */}
      <div className="absolute top-0 right-[35%] bottom-0 w-px bg-white/5 rotate-12 transform origin-bottom pointer-events-none" />
      <div className="absolute top-0 left-[20%] bottom-0 w-[100px] bg-black/5 -rotate-12 transform origin-top pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

      {/* Header */}
      <div className="py-4 sm:py-5 border-b border-white/10 text-center relative z-10 px-4">
        <h3 className="text-white text-base sm:text-lg font-medium tracking-wide">
          {fullName}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 text-white/90">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4 text-[14px] sm:text-[15px]">
            <p>
              Full Name: <span className="font-light">{fullName}</span>
            </p>
            <p>
              ID: <span className="font-light">{member.member_id_code}</span>
            </p>
            <p className="break-all">
              Username:{" "}
              <span className="font-light">{member.member_username}</span>
            </p>
          </div>

          {/* Right Column */}
          {member.member_package && (
            <div className="space-y-3 sm:space-y-4 text-[14px] sm:text-[15px] md:text-right">
              <p>
                Package:{" "}
                <span className="font-light">
                  {member.member_package || "None"}
                </span>
              </p>
              <p>
                Package CV:{" "}
                <span className="font-light">
                  {member.member_package_cv || "0"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        {member.member_package ? (
          <div className="flex items-center justify-center gap-3 w-full mt-2">
            <button
              onClick={() => handlePlace("left")}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-[#fb4f66] hover:bg-[#e03d50] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-2 sm:px-8 py-2.5 sm:py-2 rounded-[4px] transition-colors text-[13px] sm:text-sm cursor-pointer shadow-sm flex items-center justify-center gap-1 sm:gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "TO LEFT"
              )}
            </button>
            <button
              onClick={() => handlePlace("right")}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-[#10b981] hover:bg-[#0c9c6d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-2 sm:px-8 py-2.5 sm:py-2 rounded-[4px] transition-colors text-[13px] sm:text-sm cursor-pointer shadow-sm flex items-center justify-center gap-1 sm:gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "TO RIGHT"
              )}
            </button>
          </div>
        ) : (
          <div className="w-full bg-white/5 text-white/50 border border-white/10 font-medium px-4 py-3 rounded-[4px] text-[13px] sm:text-sm text-center mt-2">
            User Must be Subscribed to Package
          </div>
        )}
      </div>
    </div>
  );
}
