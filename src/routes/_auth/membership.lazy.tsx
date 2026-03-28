import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { usePackages, type Package } from "../../features/wallet/usePackages";
import api from "../../lib/api";
import { toast } from "react-hot-toast";

// Extracted Components
import { TabHeader } from "../../features/membership/components/TabHeader";
import { MembershipCard } from "../../features/membership/components/MembershipCard";
import { DetailsModal } from "../../features/membership/components/DetailsModal";
import { PaymentChoiceModal } from "../../features/membership/components/PaymentChoiceModal";

export const Route = createLazyFileRoute("/_auth/membership")({
  component: MembershipRouteComponent,
});

function MembershipRouteComponent() {
  const [activeTab, setActiveTab] = useState("nova pro");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { data: packages, isLoading } = usePackages();

  const filteredMemberships = useMemo(() => {
    if (!packages) return [];

    return packages.filter((pkg) => {
      const isNovaPro = pkg.name.toLowerCase().includes("pro+");
      return activeTab === "nova pro" ? isNovaPro : !isNovaPro;
    });
  }, [packages, activeTab]);

  const handleSubscribe = async (payBy: "token" | "stripe") => {
    if (!selectedPackage) return;

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
    <div className="min-h-[calc(100vh-100px)] bg-[#f8fafc] w-full max-w-[1500px] mx-auto flex flex-col pt-12">
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4 mb-20">
        {filteredMemberships.map((pkg) => (
          <MembershipCard
            key={pkg.id}
            pkg={pkg}
            onClick={() => {
              setSelectedPackage(pkg);
              setShowDetailsModal(true);
            }}
          />
        ))}

        {filteredMemberships.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">
            No packages found in this category.
          </div>
        )}
      </div>

      <DetailsModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        selectedPackage={selectedPackage}
        onSubscribe={() => {
          setShowDetailsModal(false);
          setShowPaymentModal(true);
        }}
      />

      <PaymentChoiceModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentChoice={handleSubscribe}
        isSubscribing={isSubscribing}
      />
    </div>
  );
}
