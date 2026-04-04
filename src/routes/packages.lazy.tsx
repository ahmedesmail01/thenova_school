import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePackages, type Package } from "../features/wallet/usePackages";
import api from "../lib/api";
import { toast } from "react-hot-toast";

// Extracted Components
import { MembershipDetailedCard } from "../features/membership/components/MembershipDetailedCard";
import { PaymentChoiceModal } from "../features/membership/components/PaymentChoiceModal";
import { useAuthStore } from "../features/auth/useAuthStore";

export const Route = createLazyFileRoute("/packages")({
  component: PackagesPage,
});

function PackagesPage() {
  const { isAuthenticated } = useAuthStore();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { data: packages, isLoading } = usePackages();

  const handleSubscribe = async (payBy: "token" | "stripe") => {
    if (!selectedPackage) return;

    if (!isAuthenticated) {
      window.location.href = "/login?redirect=/packages";
      return;
    }

    setIsSubscribing(true);
    const loadingToast = toast.loading("Processing subscription...");

    try {
      await api.post("/subscribe", {
        package_id: selectedPackage.id,
        pay_by: payBy,
      });
      toast.success("Subscribed successfully!", { id: loadingToast });
      setShowPaymentModal(false);
      setSelectedPackage(null);
    } catch (error: unknown) {
      let errorMessage = "Failed to subscribe. Please try again.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data?: { message?: string } } };
        errorMessage = err.response.data?.message || errorMessage;
      }
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubscribeClick = (pkg: Package) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/packages`;
      return;
    }
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-slate-400 font-medium animate-pulse">
          Loading memberships...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f8fafc] w-full max-w-[1700px] mx-auto flex flex-col pt-6 mt-16">
      {/* <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-4 tracking-tight">
          Choose Your <span className="text-blue-600">Membership</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto px-4 font-medium">
          Elevate your journey with our premium packages designed to give you
          the metabolic edge.
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-6 mb-24">
        {packages?.map((pkg) => (
          <MembershipDetailedCard
            key={pkg.id}
            pkg={pkg}
            onSubscribe={() => handleSubscribeClick(pkg)}
          />
        ))}

        {(!packages || packages.length === 0) && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200">
            No packages found at the moment.
          </div>
        )}
      </div>

      <PaymentChoiceModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentChoice={handleSubscribe}
        isSubscribing={isSubscribing}
      />
    </div>
  );
}
