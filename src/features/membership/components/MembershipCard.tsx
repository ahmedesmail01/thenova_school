import { type Package } from "../../wallet/usePackages";

interface MembershipCardProps {
  pkg: Package;
  onClick: () => void;
}

export function MembershipCard({ pkg, onClick }: MembershipCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-[20px] bg-linear-to-br from-[#2f4b7c] to-[#1e3a5f] text-white aspect-4/2.5 shadow-md cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 group"
    >
      {pkg.pack_card ? (
        <img
          src={pkg.pack_card}
          alt={pkg.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          {/* Background Wavy Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[120%] bg-white/10 rounded-full blur-[2px]" />
            <svg
              className="absolute bottom-0 left-0 w-full h-full object-cover"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,60 C30,70 60,40 100,50 L100,100 L0,100 Z"
                fill="rgba(255,255,255,0.05)"
              />
              <path
                d="M0,80 C40,90 70,50 100,60 L100,100 L0,100 Z"
                fill="rgba(255,255,255,0.08)"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <h3 className="text-xl font-bold tracking-wide capitalize">
              {pkg.name}
            </h3>
            <p className="text-[15px] font-bold text-white/90">
              ${Number(pkg.price).toFixed(2)}
              <span className="text-[12px] font-normal opacity-70 ml-1">
                / {pkg.billing_period}
              </span>
            </p>
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors">
                Tap to view details
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
