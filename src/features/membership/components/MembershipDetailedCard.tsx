import { type Package } from "../../wallet/usePackages";

interface MembershipDetailedCardProps {
  pkg: Package;
  onSubscribe: () => void;
}

export function MembershipDetailedCard({
  pkg,
  onSubscribe,
}: MembershipDetailedCardProps) {
  const isPro = pkg.name.toLowerCase().includes("pro+");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 relative">
      {/* PRO Tag */}
      {isPro && (
        <div className="absolute top-4 right-4 z-20 bg-linear-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
          PRO
        </div>
      )}

      {/* Dark Slanted Header - FIXED */}
      <div className="relative rounded-lg bg-[#1e3a5f] pt-8 pb-12 px-6 overflow-hidden shrink-0">
        <div
          className="absolute bottom-0 left-0 w-full h-10 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        />
        <h2 className="relative z-10 text-2xl font-bold text-white text-center capitalize tracking-tight">
          {pkg.name}
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6 pb-4 flex flex-col items-center no-scrollbar">
        {/* Price and CV */}
        <div className="text-center mb-6 -mt-2 relative z-10 shrink-0">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-[32px] font-bold text-[#1a1a1a]">
              {Number(pkg.price).toFixed(0)}
            </span>
            <span className="text-[16px] font-medium text-[#4a4a4a]">
              /{" "}
              {pkg.billing_period === "annually"
                ? "Annually"
                : pkg.billing_period}
            </span>
          </div>
          <p className="text-[14px] font-medium text-[#4a4a4a] mt-0.5">
            {pkg.cv} CV
          </p>
        </div>

        {/* Features List */}
        <ul className="w-full space-y-2 mb-6">
          {Object.entries(pkg.features).map(([feature, enabled]) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-[13.5px] font-medium text-[#333]"
            >
              {enabled ? (
                <svg
                  className="w-4 h-4 mt-0.5 shrink-0 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 mt-0.5 shrink-0 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
              <span className="capitalize">{feature.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer with Button - FIXED */}
      <div className="px-6 pb-6 pt-3 bg-white border-t border-slate-50 shrink-0 mt-auto">
        <button
          onClick={onSubscribe}
          className="w-full py-3 rounded-lg text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg bg-linear-to-r from-[#4d90cd] to-[#12243d]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
