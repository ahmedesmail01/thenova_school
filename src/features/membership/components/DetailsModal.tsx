import { Modal } from "../../../components/ui/Modal";
import { type Package } from "../../wallet/usePackages";

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  onSubscribe: () => void;
}

export function DetailsModal({
  open,
  onClose,
  selectedPackage,
  onSubscribe,
}: DetailsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-[400px]! p-4! overflow-hidden bg-white! max-h-[90vh] flex flex-col"
    >
      {selectedPackage && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Dark Slanted Header - FIXED */}
          <div className="relative rounded-lg bg-[#1e3a5f] pt-8 pb-12 px-6 overflow-hidden shrink-0">
            <div
              className="absolute bottom-0 left-0 w-full h-10 bg-white"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
            />
            <h2 className="relative z-10 text-2xl font-bold text-white text-center capitalize tracking-tight">
              {selectedPackage.name}
            </h2>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col items-center no-scrollbar">
            {/* Price and CV */}
            <div className="text-center mb-6 -mt-2 relative z-10 shrink-0">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-[32px] font-bold text-[#1a1a1a]">
                  {Number(selectedPackage.price).toFixed(0)}
                </span>
                <span className="text-[16px] font-medium text-[#4a4a4a]">
                  /{" "}
                  {selectedPackage.billing_period === "annually"
                    ? "Annually"
                    : selectedPackage.billing_period}
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#4a4a4a] mt-0.5">
                {selectedPackage.cv} CV
              </p>
            </div>

            {/* Features List */}
            <ul className="w-full space-y-2 mb-6">
              {Object.entries(selectedPackage.features).map(
                ([feature, enabled]) => (
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
                    <span className="capitalize">
                      {feature.replace(/_/g, " ")}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Footer with Button - FIXED */}
          <div className="px-6 pb-6 pt-3 bg-white border-t border-slate-50 shrink-0">
            <button
              onClick={onSubscribe}
              className="w-full py-3 rounded-lg text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg bg-linear-to-r from-[#4d90cd] to-[#12243d]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
