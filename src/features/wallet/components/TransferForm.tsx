import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { useTransferToTokenWallet } from "../useWalletTotals";
import toast from "react-hot-toast";

export function TransferForm() {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const transferMutation = useTransferToTokenWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsPinModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!pin) {
      toast.error("Please enter your PIN");
      return;
    }

    transferMutation.mutate(
      { amount: Number(amount), pin },
      {
        onSuccess: () => {
          setAmount("");
          setPin("");
          setIsPinModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100/60">
        <h3 className="font-bold text-[22px] text-[#4a5568] tracking-tight">
          Transfer to Token Wallet
        </h3>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="relative">
          {/* Floating Label Style */}
          <label className="absolute -top-2.5 left-4 px-2 bg-white text-[13px] font-semibold text-[#718096] z-10">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "+") {
                e.preventDefault();
              }
            }}
            placeholder="amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-700 rounded-[12px] text-black px-5 py-4 text-base placeholder:text-[#a0aec0] focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={transferMutation.isPending}
          className="w-full bg-linear-to-r from-brand-navy via-brand-terquaz to-brand-navy  text-white font-semibold py-4 rounded-[12px] transition-all shadow-lg shadow-slate-900/10 text-lg disabled:opacity-50"
        >
          {transferMutation.isPending ? "Processing..." : "Send"}
        </button>
      </form>

      {/* PIN Confirmation Modal */}
      <Modal open={isPinModalOpen} onClose={() => setIsPinModalOpen(false)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Confirm PIN Code</h3>
            <p className="text-slate-400">
              Please enter your PIN code to confirm this transfer.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="PIN Code"
              maxLength={4}
              autoComplete="new-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-brand-blue transition-all text-center tracking-[1em] text-xl font-bold font-mono"
            />

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPinModalOpen(false)}
                disabled={transferMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmTransfer}
                disabled={transferMutation.isPending}
              >
                {transferMutation.isPending ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
